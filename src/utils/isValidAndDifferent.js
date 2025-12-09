export const isValidAndDifferent = (obj1, obj2) => {
  // Check for null or empty values
  const hasEmptyValues = Object.values(obj1).some(value => value === null || value === '');

  if (hasEmptyValues) return false;

  // Function to create a sorted JSON string for accurate comparison
  const sortObject = (obj) => JSON.stringify(Object.keys(obj).sort().reduce((acc, key) => {
    acc[key] = obj[key];
    return acc;
  }, {}));

  // Compare objects in a stable, sorted manner
  const isIdentical = sortObject(obj1) === sortObject(obj2);

  return !isIdentical;
};

export default isValidAndDifferent;
