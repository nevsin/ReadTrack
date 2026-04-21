import { GOOGLE_BOOKS_API_KEY } from "./config";

const MAX_RECOMMENDATIONS = 20;
const MIN_RECOMMENDATIONS = 15;
const MAX_PER_AUTHOR = 3;
const MAX_SEED_BOOKS = 8;

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

function normalizeStatus(status) {
  const value = normalize(status);

  if (value === "completed before this year") {
    return "completed_before_this_year";
  }

  if (value === "completed") return "completed";
  if (value === "reading") return "reading";
  return "want_to_read";
}

function statusWeight(status) {
  const normalizedStatus = normalizeStatus(status);

  if (normalizedStatus === "completed") return 4;
  if (normalizedStatus === "reading") return 3;
  if (normalizedStatus === "completed_before_this_year") return 2;
  return 1;
}

function isPriorityStatus(status) {
  const normalizedStatus = normalizeStatus(status);
  return (
    normalizedStatus === "completed" ||
    normalizedStatus === "reading" ||
    normalizedStatus === "completed_before_this_year"
  );
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
  if (title.includes("journal")) return true;
  if (title.includes("magazine")) return true;
  if (title.includes("dergi")) return true;
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

function buildUserProfile(libraryBooks = []) {
  const profile = {
    totalWeight: 0,
    categories: {},
    authors: {},
    languages: {},
    statuses: {},
    topBooks: [],
  };

  libraryBooks.forEach((book) => {
    const weight = statusWeight(book?.status);
    const author = normalize(getPrimaryAuthor(book));
    const language = normalize(book?.language);
    const categories = getNormalizedCategories(book);
    const status = normalizeStatus(book?.status);

    profile.totalWeight += weight;
    profile.statuses[status] = (profile.statuses[status] || 0) + weight;

    if (author) {
      profile.authors[author] = (profile.authors[author] || 0) + weight;
    }

    if (language) {
      profile.languages[language] = (profile.languages[language] || 0) + weight;
    }

    categories.forEach((category) => {
      if (!category) return;
      profile.categories[category] = (profile.categories[category] || 0) + weight;
    });

    profile.topBooks.push({
      ...book,
      _weight: weight,
    });
  });

  profile.topBooks.sort((a, b) => b._weight - a._weight);

  return profile;
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

function buildSeedQueries(seedBook, profile) {
  const author = getPrimaryAuthor(seedBook);
  const language = normalize(seedBook?.language);
  const categories = getNormalizedCategories(seedBook);

  const topProfileCategories = Object.entries(profile.categories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([category]) => category);

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

  topProfileCategories.forEach((category) => {
    queries.push({
      query: `subject:"${category}"`,
      lang: language,
      seedBook,
    });
  });

  return queries;
}

function scoreCandidateAgainstProfile(candidate, profile) {
  let score = 0;

  const candidateAuthor = normalize(getPrimaryAuthor(candidate));
  const candidateLanguage = normalize(candidate?.language);
  const candidateCategories = getNormalizedCategories(candidate);

  if (candidateAuthor && profile.authors[candidateAuthor]) {
    score += profile.authors[candidateAuthor] * 1.8;
  }

  candidateCategories.forEach((category) => {
    if (profile.categories[category]) {
      score += profile.categories[category] * 2.2;
    }
  });

  if (candidateLanguage && profile.languages[candidateLanguage]) {
    score += profile.languages[candidateLanguage] * 1.2;
  }

  if (candidate.thumbnail) score += 1;
  if (candidate.description) score += 1;
  if (candidate.pageCount) score += 0.5;

  return score;
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
    score += 9;
  }

  seedCategories.forEach((category) => {
    if (category && candidateCategories.includes(category)) {
      score += 8;
    }
  });

  if (candidateLanguage && seedLanguage && candidateLanguage === seedLanguage) {
    score += 3;
  }

  return score;
}

function buildReason(candidate, seedBook, profile) {
  const candidateAuthor = normalize(getPrimaryAuthor(candidate));
  const seedAuthor = normalize(getPrimaryAuthor(seedBook));
  const candidateCategories = getNormalizedCategories(candidate);

  const sortedProfileCategories = Object.entries(profile.categories)
    .sort((a, b) => b[1] - a[1])
    .map(([category]) => category);

  const matchedProfileCategory = sortedProfileCategories.find((category) =>
    candidateCategories.includes(category)
  );

  if (matchedProfileCategory) {
    const displayCategory =
      getCategories(candidate).find(
        (category) =>
          normalize(getMainCategory(category)) === matchedProfileCategory
      ) || matchedProfileCategory;

    return `Suggested because it matches your preferred category: ${getMainCategory(
      displayCategory
    )}.`;
  }

  if (candidateAuthor && seedAuthor && candidateAuthor === seedAuthor) {
    return `Suggested because it matches an author in your reading profile: ${getPrimaryAuthor(
      seedBook
    )}.`;
  }

  return `Suggested because it is similar to ${getBookTitle(seedBook)} in your library.`;
}

async function collectCandidates(seedBooks, libraryBooks, profile) {
  const queryConfigs = seedBooks.flatMap((seedBook) =>
    buildSeedQueries(seedBook, profile)
  );

  const settledResults = await Promise.allSettled(
    queryConfigs.map((config) => fetchBooks(config.query, 10, config.lang))
  );

  let strongCandidates = [];
  let backupCandidates = [];

  settledResults.forEach((result, index) => {
    if (result.status !== "fulfilled") return;

    const config = queryConfigs[index];
    const seedBook = config.seedBook;

    result.value.forEach((candidate) => {
      if (isSameAsLibraryBook(candidate, libraryBooks)) return;
      if (looksBadCandidate(candidate)) return;

      const seedScore = scoreCandidateAgainstSeed(candidate, seedBook);
      const profileScore = scoreCandidateAgainstProfile(candidate, profile);
      const finalScore = seedScore + profileScore;

      const preparedCandidate = {
        ...candidate,
        score: finalScore,
        reason: buildReason(candidate, seedBook, profile),
      };

      if (finalScore >= 7) {
        strongCandidates.push(preparedCandidate);
      } else if (finalScore >= 4) {
        backupCandidates.push(preparedCandidate);
      }
    });
  });

  strongCandidates = dedupeByTitleAndAuthor(strongCandidates).sort(
    (a, b) => (b.score || 0) - (a.score || 0)
  );

  backupCandidates = dedupeByTitleAndAuthor(backupCandidates).sort(
    (a, b) => (b.score || 0) - (a.score || 0)
  );

  let combined = applyAuthorBalance(strongCandidates, MAX_PER_AUTHOR);

  if (combined.length < MIN_RECOMMENDATIONS) {
    const existingKeys = new Set(
      combined.map(
        (book) =>
          `${normalize(getBookTitle(book))}::${normalize(getPrimaryAuthor(book))}`
      )
    );

    const fillerBooks = backupCandidates.filter((book) => {
      const key = `${normalize(getBookTitle(book))}::${normalize(
        getPrimaryAuthor(book)
      )}`;
      return !existingKeys.has(key);
    });

    combined = applyAuthorBalance(
      [...combined, ...fillerBooks],
      MAX_PER_AUTHOR
    );
  }

  return combined.slice(0, MAX_RECOMMENDATIONS);
}

export async function getPersonalizedRecommendations(libraryBooks = []) {
  const cleanLibrary = safeArray(libraryBooks).filter(
    (book) => getBookTitle(book) || getPrimaryAuthor(book)
  );

  if (!cleanLibrary.length) {
    return [];
  }

  const enrichedLibrary = await enrichLibraryBooks(cleanLibrary);
  const profile = buildUserProfile(enrichedLibrary);
  const seedBooks = pickSeedBooks(enrichedLibrary);

  if (!seedBooks.length) {
    return [];
  }

  const results = await collectCandidates(seedBooks, enrichedLibrary, profile);

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