export const calculateReadingTime = (content) => {
  if (!content) return 0;
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

export const formatReadingTime = (minutes) => {
  if (!minutes) return "1 min read";
  return `${minutes} min read`;
};