export const calculateReadingTime = (content) => {
  const wordsPerMinute = 200;
  const wordCount = content?.trim().split(/\s+/).length || 0;
  return Math.ceil(wordCount / wordsPerMinute);
};