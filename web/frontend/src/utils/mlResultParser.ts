export function parseMlResult(result: string) {
  try {
    console.log(result);
    const parsed = JSON.parse(result);
    return parsed[0] === 0;
  } catch (err) {
    return err;
  }
}
