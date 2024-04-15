export function parseMlResult(result: string) {
  try {
    console.log(result);
    return result[0] === "T";
  } catch (err) {
    return err;
  }
}
