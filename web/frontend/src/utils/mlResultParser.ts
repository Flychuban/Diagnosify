export function parseMlResult(result: string) {
  try {
    console.log(result);
    return result.startsWith("T"); // since we recieved from the backend in this format "True"
  } catch (err) {
    return err;
  }
}
