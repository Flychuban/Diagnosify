import { getBaseUrl } from "~/utils/getHost";

console.log("was test succesful:", getBaseUrl("http://localhost:3000/") === "http://localhost:3000", getBaseUrl("http://localhost:3000/"))
console.log("was test succesful:", getBaseUrl("https://example.com/api/v1/users") === "https://example.com")
console.log("was test succesful:", getBaseUrl("https://www.example.com/blog/2022/01/01/hello-world") === "https://www.example.com")
console.log("was test succesful:", getBaseUrl("https://www.example.com/blog/2022/01/01/hello-world/") === "https://www.example.com")
console.log("was test succesful:", getBaseUrl("https://www.example.com/blog/2022/01/01/") === "https://www.example.com")
console.log("was test succesful:", getBaseUrl("http://localhost:3000") === "http://localhost:3000", getBaseUrl("https://localhost:3000"))