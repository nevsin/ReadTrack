import { GOOGLE_BOOKS_API_KEY } from "./config";

const MIN_RECOMMENDATIONS = 12;
const MAX_RECOMMENDATIONS = 16;

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

function cleanWord(word) {
  return String(word || "")
    .toLowerCase()
    .replace(/[^a-z0-9ğüşöçıİĞÜŞÖÇ]/gi, "");
}

function getTitleKeywords(title) {
  const stopWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "of",
    "to",
    "in",
    "on",
    "for",
    "with",
    "book",
    "books",
    "novel",
    "story",
    "stories",
    "volume",
    "part",
  ]);

  return String(title || "")
    .split(/\s+/)
    .map(cleanWord)
    .filter((word) => word.length >= 3 && !stopWords.has(word));
}

function normalizeThumbnailUrl(url) {
  if (!url) return "";
  return String(url).replace(/^http:\/\//i, "https://");
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

async function fetchBooks(query, maxResults = 20) {
  if (!query) return [];

  const baseUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
    query
  )}&maxResults=${maxResults}`;

  const url = GOOGLE_BOOKS_API_KEY ? `${baseUrl}&key=${GOOGLE_BOOKS_API_KEY}` : baseUrl;

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

    if (candidateTitle && libraryTitle && candidateTitle === libraryTitle) {
      return true;
    }

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

    return false;
  });
}

function dedupeByTitle(books) {
  return books.filter((book, index, self) => {
    const title = normalize(getBookTitle(book));
    if (!title) return false;

    return (
      index ===
      self.findIndex((item) => normalize(getBookTitle(item)) === title)
    );
  });
}

function applyAuthorBalance(books, maxPerAuthor = 2) {
  const counts = {};

  return books.filter((book) => {
    const author = normalize(getPrimaryAuthor(book));
    if (!author) return true;

    counts[author] = (counts[author] || 0) + 1;
    return counts[author] <= maxPerAuthor;
  });
}

async function enrichLibraryBooks(libraryBooks = []) {
  const enriched = [];

  for (const book of libraryBooks) {
    const title = getBookTitle(book);
    const author = getPrimaryAuthor(book);

    const queries = [];

    if (title && author) {
      queries.push(`intitle:${title} inauthor:${author}`);
      queries.push(`${title} ${author}`);
    }

    if (title) {
      queries.push(`intitle:${title}`);
      queries.push(title);
    }

    let bestMatch = null;

    for (const query of queries) {
      const results = await fetchBooks(query, 10);

      if (results.length > 0) {
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
    }

    enriched.push({
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
    });
  }

  return enriched;
}

function buildLibraryProfile(libraryBooks = []) {
  const authorCounts = {};
  const categoryCounts = {};
  const keywordCounts = {};

  libraryBooks.forEach((book) => {
    const author = normalize(getPrimaryAuthor(book));
    const categories = getCategories(book).map((item) =>
      normalize(getMainCategory(item))
    );
    const keywords = getTitleKeywords(getBookTitle(book));

    if (author) {
      authorCounts[author] = (authorCounts[author] || 0) + 1;
    }

    categories.forEach((category) => {
      if (category) {
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      }
    });

    keywords.forEach((keyword) => {
      keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
    });
  });

  const sortKeys = (obj, limit) =>
    Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([key]) => key);

  return {
    topAuthors: sortKeys(authorCounts, 5),
    topCategories: sortKeys(categoryCounts, 6),
    topKeywords: sortKeys(keywordCounts, 8),
  };
}

function buildProfileQueries(profile, libraryBooks) {
  const queries = [];

  profile.topCategories.forEach((category) => {
    queries.push(`subject:${category}`);
    queries.push(`${category} books`);
    queries.push(`${category} novels`);
    queries.push(`${category} recommended books`);
  });

  profile.topAuthors.forEach((author) => {
    queries.push(`inauthor:${author}`);
  });

  for (
    let i = 0;
    i < Math.min(profile.topCategories.length, profile.topKeywords.length, 4);
    i += 1
  ) {
    queries.push(`subject:${profile.topCategories[i]} ${profile.topKeywords[i]}`);
  }

  for (
    let i = 0;
    i < Math.min(profile.topAuthors.length, profile.topKeywords.length, 3);
    i += 1
  ) {
    queries.push(`${profile.topAuthors[i]} ${profile.topKeywords[i]}`);
  }

  libraryBooks.forEach((book) => {
    const title = getBookTitle(book);
    const author = getPrimaryAuthor(book);
    const categories = getCategories(book).map(getMainCategory).filter(Boolean);
    const keywords = getTitleKeywords(title);

    if (author && categories[0]) {
      queries.push(`${author} ${categories[0]}`);
    }

    if (title && author) {
      queries.push(`${title} ${author}`);
    }

    if (keywords.length >= 2) {
      queries.push(`${keywords[0]} ${keywords[1]}`);
    }

    if (categories[0] && keywords[0]) {
      queries.push(`${categories[0]} ${keywords[0]}`);
    }
  });

  return [...new Set(queries)].filter(Boolean).slice(0, 30);
}

function buildFallbackQueries(profile) {
  const queries = [
    "award winning novels",
    "recommended fiction books",
    "best books to read",
    "must read novels",
    "popular literature books",
    "top rated books",
    "best modern fiction",
    "popular classic books",
  ];

  profile.topCategories.slice(0, 4).forEach((category) => {
    queries.push(`${category} bestseller`);
    queries.push(`${category} top books`);
    queries.push(`${category} recommended novels`);
  });

  profile.topAuthors.slice(0, 3).forEach((author) => {
    queries.push(`inauthor:${author}`);
  });

  return [...new Set(queries)].filter(Boolean);
}

function scoreCandidate(candidate, profile) {
  let score = 0;

  const candidateAuthor = normalize(getPrimaryAuthor(candidate));
  const candidateCategories = getCategories(candidate).map((item) =>
    normalize(getMainCategory(item))
  );
  const candidateTitle = normalize(getBookTitle(candidate));

  if (profile.topAuthors.includes(candidateAuthor)) {
    score += 10;
  }

  profile.topCategories.forEach((category) => {
    if (candidateCategories.includes(category)) {
      score += 8;
    }
  });

  profile.topKeywords.forEach((keyword) => {
    if (candidateTitle.includes(keyword)) {
      score += 3;
    }
  });

  if (candidate.description) score += 1;
  if (candidate.thumbnail) score += 1;

  return score;
}

function buildReason(candidate, profile) {
  const candidateAuthor = normalize(getPrimaryAuthor(candidate));
  const candidateCategories = getCategories(candidate).map((item) =>
    normalize(getMainCategory(item))
  );
  const candidateTitle = normalize(getBookTitle(candidate));

  if (profile.topAuthors.includes(candidateAuthor) && candidateAuthor) {
    return `Suggested because it matches an author pattern in your library: ${getPrimaryAuthor(
      candidate
    )}.`;
  }

  const matchedCategory = profile.topCategories.find((category) =>
    candidateCategories.includes(category)
  );

  if (matchedCategory) {
    return `Suggested because it matches one of your main reading categories: ${getMainCategory(
      getCategories(candidate)[0]
    )}.`;
  }

  const matchedKeyword = profile.topKeywords.find((keyword) =>
    candidateTitle.includes(keyword)
  );

  if (matchedKeyword) {
    return "Suggested because it shares a similar title/theme pattern with books in your library.";
  }

  return "Suggested based on your full library profile.";
}

async function collectCandidates(queries, libraryBooks, profile) {
  const settled = await Promise.allSettled(
    queries.map((query) => fetchBooks(query, 20))
  );

  let collected = [];

  settled.forEach((result) => {
    if (result.status === "fulfilled") {
      collected = collected.concat(result.value);
    }
  });

  collected = collected
    .filter((candidate) => !isSameAsLibraryBook(candidate, libraryBooks))
    .map((candidate) => ({
      ...candidate,
      score: scoreCandidate(candidate, profile),
      reason: buildReason(candidate, profile),
    }));

  let results = dedupeByTitle(collected)
    .filter((book) => getBookTitle(book))
    .sort((a, b) => (b.score || 0) - (a.score || 0));

  results = applyAuthorBalance(results, 2);

  return results;
}

export async function getPersonalizedRecommendations(libraryBooks = []) {
  const cleanLibrary = safeArray(libraryBooks).filter(
    (book) => getBookTitle(book) || getPrimaryAuthor(book)
  );

  if (!cleanLibrary.length) {
    return [];
  }

  const enrichedLibrary = await enrichLibraryBooks(cleanLibrary);
  const profile = buildLibraryProfile(enrichedLibrary);

  const primaryQueries = buildProfileQueries(profile, enrichedLibrary);
  let results = await collectCandidates(primaryQueries, enrichedLibrary, profile);

  if (results.length < MIN_RECOMMENDATIONS) {
    const fallbackQueries = buildFallbackQueries(profile);
    results = await collectCandidates(
      [...primaryQueries, ...fallbackQueries],
      enrichedLibrary,
      profile
    );
  }

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