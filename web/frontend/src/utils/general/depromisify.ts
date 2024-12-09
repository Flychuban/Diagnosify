async function depromisifyObject<T>(obj: object): T {
  const result = {};
  
  // Iterate through all keys in the object
  for (const [key, value] of Object.entries(obj)) {
    // If the value is a Promise, resolve it
    result[key] = value instanceof Promise ? await value : value;
  }

  return result as T
}
