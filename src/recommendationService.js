import { GOOGLE_BOOKS_API_KEY } from "./config";

const MAX_RECOMMENDATIONS = 12;
const MAX_PER_AUTHOR = 2;
const MAX_SEED_BOOKS = 6;

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function getBookTitle(book) {
  return String(book?.title || book?.bookName || "").trim();
}

function getPrimaryAuthor(book) {
  if (typeof book?.author === "string" && book.author.trim()) {
    return book.author.split(",")[0].trim();
  }

  if (Array.isArray(book?.authors) && book.authors.length > 0) {
    return String(book.authors[0] || "").trim();
  }

  return "";
}

function getCategories(book) {
  return safeArray(book?.categories)
    .map((item) => String(item || "").trim())
    .filter(Boolean);
}

function getMainCategory(category) {
  return String(category || "").split("/")[0].trim();
}

function getNormalizedCategories(book) {
  return getCategories(book).map((item) => normalize(getMainCategory(item)));
}

function normalizeThumbnailUrl(url) {
  if (!url) return "";
  return String(url).replace(/^http:\/\//i, "https://");
}

function isPriorityStatus(status) {
  const normalizedStatus = normalize(status);
  return normalizedStatus === "completed" || normalizedStatus === "reading";
}

function statusWeight(status) {
  const normalizedStatus = normalize(status);

  if (normalizedStatus === "completed") return 3;
  if (normalizedStatus === "reading") return 2;
  if (normalizedStatus === "want to read") return 1;

  return 1;
}

function mapGoogleBook(item) {
  const info = item?.volumeInfo || {};
  const thumbnail =
    normalizeThumbnailUrl(info.imageLinks?.thumbnail) ||
    normalizeThumbnailUrl(info.imageLinks?.smallThumbnail) ||
    "";

  return {
    id: item?.id || "",
    googleBooksId: item?.id || "",
    title: info.title || "Untitled",
    author: safeArray(info.authors).join(", ") || "Unknown Author",
    authors: safeArray(info.authors),
    categories: safeArray(info.categories),
    language: info.language || "",
    description: info.description || "",
    publishedDate: info.publishedDate || "",
    pageCount: info.pageCount || "",
    thumbnail,
    cover: thumbnail,
  };
}

async function fetchBooks(query, maxResults = 10, langRestrict = "") {
  if (!query) return [];

  const params = new URLSearchParams({
    q: query,
    maxResults: String(maxResults),
  });

  if (langRestrict) {
    params.set("langRestrict", langRestrict);
  }

  if (GOOGLE_BOOKS_API_KEY) {
    params.set("key", GOOGLE_BOOKS_API_KEY);
  }

  const url = `https://www.googleapis.com/books/v1/volumes?${params.toString()}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error("Recommendation fetch failed:", response.status, query);
      return [];
    }

    const data = await response.json();
    return safeArray(data.items).map(mapGoogleBook);
  } catch (error) {
    console.error("Recommendation fetch error:", error, query);
    return [];
  }
}

function isSameAsLibraryBook(candidate, libraryBooks) {
  const candidateTitle = normalize(getBookTitle(candidate));
  const candidateAuthor = normalize(getPrimaryAuthor(candidate));

  return libraryBooks.some((book) => {
    const libraryTitle = normalize(getBookTitle(book));
    const libraryAuthor = normalize(getPrimaryAuthor(book));

    if (
      candidateTitle &&
      candidateAuthor &&
      libraryTitle &&
      libraryAuthor &&
      candidateTitle === libraryTitle &&
      candidateAuthor === libraryAuthor
    ) {
      return true;
    }

    if (candidateTitle && libraryTitle && candidateTitle === libraryTitle) {
      return true;
    }

    return false;
  });
}

function dedupeByTitleAndAuthor(books) {
  return books.filter((book, index, self) => {
    const key = `${normalize(getBookTitle(book))}::${normalize(
      getPrimaryAuthor(book)
    )}`;

    if (key === "::") return false;

    return (
      index ===
      self.findIndex(
        (item) =>
          `${normalize(getBookTitle(item))}::${normalize(
            getPrimaryAuthor(item)
          )}` === key
      )
    );
  });
}

function applyAuthorBalance(books, maxPerAuthor = MAX_PER_AUTHOR) {
  const authorCounts = {};

  return books.filter((book) => {
    const author = normalize(getPrimaryAuthor(book));

    if (!author) return true;

    authorCounts[author] = (authorCounts[author] || 0) + 1;
    return authorCounts[author] <= maxPerAuthor;
  });
}

function looksBadCandidate(book) {
  const title = normalize(getBookTitle(book));
  const author = normalize(getPrimaryAuthor(book));

  if (!title) return true;
  if (title.includes("dergi")) return true;
  if (title.includes("journal")) return true;
  if (title.includes("magazine")) return true;
  if (author === "unknown author") return true;

  return false;
}

async function enrichLibraryBooks(libraryBooks = []) {
  const enrichedBooks = [];

  for (const book of libraryBooks) {
    const title = getBookTitle(book);
    const author = getPrimaryAuthor(book);

    if (!title) {
      enrichedBooks.push(book);
      continue;
    }

    const queries = [];

    if (title && author) {
      queries.push(`intitle:"${title}" inauthor:"${author}"`);
      queries.push(`"${title}" "${author}"`);
    }

    queries.push(`intitle:"${title}"`);
    queries.push(`"${title}"`);

    let bestMatch = null;

    for (const query of queries) {
      const results = await fetchBooks(query, 5);

      if (!results.length) continue;

      const exactMatch = results.find((result) => {
        const sameTitle =
          normalize(getBookTitle(result)) === normalize(title);
        const sameAuthor =
          !author ||
          normalize(getPrimaryAuthor(result)) === normalize(author);

        return sameTitle && sameAuthor;
      });

      bestMatch = exactMatch || results[0];
      if (bestMatch) break;
    }

    enrichedBooks.push({
      ...book,
      title,
      author: author || getPrimaryAuthor(bestMatch),
      authors: bestMatch?.authors || (author ? [author] : []),
      categories: bestMatch?.categories || getCategories(book),
      language: bestMatch?.language || book?.language || "",
      description: bestMatch?.description || book?.description || "",
      publishedDate: bestMatch?.publishedDate || book?.publishedDate || "",
      pageCount: bestMatch?.pageCount || book?.pageCount || "",
      thumbnail: bestMatch?.thumbnail || book?.thumbnail || book?.cover || "",
      cover: bestMatch?.cover || book?.cover || book?.thumbnail || "",
      status: book?.status || "Want to Read",
    });
  }

  return enrichedBooks;
}

function pickSeedBooks(libraryBooks = []) {
  const prioritized =
    libraryBooks.filter((book) => isPriorityStatus(book?.status)).length > 0
      ? libraryBooks.filter((book) => isPriorityStatus(book?.status))
      : libraryBooks;

  return [...prioritized]
    .sort((a, b) => statusWeight(b?.status) - statusWeight(a?.status))
    .slice(0, MAX_SEED_BOOKS);
}

function buildSeedQueries(seedBook) {
  const author = getPrimaryAuthor(seedBook);
  const language = normalize(seedBook?.language);
  const categories = getNormalizedCategories(seedBook);

  const queries = [];

  if (author) {
    queries.push({
      query: `inauthor:"${author}"`,
      lang: language,
      seedBook,
    });
  }

  categories.slice(0, 2).forEach((category) => {
    queries.push({
      query: `subject:"${category}"`,
      lang: language,
      seedBook,
    });

    if (author) {
      queries.push({
        query: `subject:"${category}" inauthor:"${author}"`,
        lang: language,
        seedBook,
      });
    }
  });

  return queries;
}

function scoreCandidateAgainstSeed(candidate, seedBook) {
  let score = 0;

  const candidateAuthor = normalize(getPrimaryAuthor(candidate));
  const seedAuthor = normalize(getPrimaryAuthor(seedBook));

  const candidateCategories = getNormalizedCategories(candidate);
  const seedCategories = getNormalizedCategories(seedBook);

  const candidateLanguage = normalize(candidate?.language);
  const seedLanguage = normalize(seedBook?.language);

  if (candidateAuthor && seedAuthor && candidateAuthor === seedAuthor) {
    score += 12;
  }

  seedCategories.forEach((category) => {
    if (category && candidateCategories.includes(category)) {
      score += 6;
    }
  });

  if (candidateLanguage && seedLanguage && candidateLanguage === seedLanguage) {
    score += 3;
  }

  if (candidate.thumbnail) score += 1;
  if (candidate.description) score += 1;

  return score;
}

function buildReasonFromSeed(candidate, seedBook) {
  const candidateAuthor = normalize(getPrimaryAuthor(candidate));
  const seedAuthor = normalize(getPrimaryAuthor(seedBook));

  if (candidateAuthor && seedAuthor && candidateAuthor === seedAuthor) {
    return `Suggested because it matches an author in your library: ${getPrimaryAuthor(
      seedBook
    )}.`;
  }

  const candidateCategories = getCategories(candidate);
  const seedCategories = getNormalizedCategories(seedBook);

  const matchedCategory = seedCategories.find((category) =>
    getNormalizedCategories(candidate).includes(category)
  );

  if (matchedCategory) {
    const displayCategory =
      candidateCategories.find(
        (category) =>
          normalize(getMainCategory(category)) === matchedCategory
      ) || matchedCategory;

    return `Suggested because it matches your reading category: ${getMainCategory(
      displayCategory
    )}.`;
  }

  return `Suggested because it is similar to ${getBookTitle(seedBook)}.`;
}

async function collectCandidates(seedBooks, libraryBooks) {
  const queryConfigs = seedBooks.flatMap(buildSeedQueries);

  const settledResults = await Promise.allSettled(
    queryConfigs.map((config) => fetchBooks(config.query, 8, config.lang))
  );

  let collected = [];

  settledResults.forEach((result, index) => {
    if (result.status !== "fulfilled") return;

    const config = queryConfigs[index];
    const seedBook = config.seedBook;

    result.value.forEach((candidate) => {
      if (isSameAsLibraryBook(candidate, libraryBooks)) return;
      if (looksBadCandidate(candidate)) return;

      const score = scoreCandidateAgainstSeed(candidate, seedBook);

      if (score < 6) return;

      collected.push({
        ...candidate,
        score,
        reason: buildReasonFromSeed(candidate, seedBook),
      });
    });
  });

  collected = dedupeByTitleAndAuthor(collected)
    .sort((a, b) => (b.score || 0) - (a.score || 0));

  collected = applyAuthorBalance(collected, MAX_PER_AUTHOR);

  return collected;
}

export async function getPersonalizedRecommendations(libraryBooks = []) {
  const cleanLibrary = safeArray(libraryBooks).filter(
    (book) => getBookTitle(book) || getPrimaryAuthor(book)
  );

  if (!cleanLibrary.length) {
    return [];
  }

  const enrichedLibrary = await enrichLibraryBooks(cleanLibrary);
  const seedBooks = pickSeedBooks(enrichedLibrary);

  if (!seedBooks.length) {
    return [];
  }

  const results = await collectCandidates(seedBooks, enrichedLibrary);

  return results.slice(0, MAX_RECOMMENDATIONS);
}

export async function getBookRecommendations(libraryBooks = []) {
  return getPersonalizedRecommendations(libraryBooks);
}

export async function generateRecommendations(libraryBooks = []) {
  return getPersonalizedRecommendations(libraryBooks);
}

export async function getFreshRecommendations(libraryBooks = []) {
  return getPersonalizedRecommendations(libraryBooks);
}

export default getPersonalizedRecommendations;