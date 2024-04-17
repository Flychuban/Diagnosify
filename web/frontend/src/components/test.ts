import axios from "axios";

// Define the URL of the endpoint
const url = "http://example.com/ml/route";
// Assuming you have a file to upload, you can create a FormData object
const formData = new FormData();
formData.append("file", file); // 'file' is the name of the file parameter expected by the server

// Make the Axios POST request
axios
  .post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data", // Ensure to set the correct content type for file uploads
    },
  })
  .then((response) => {
    // Handle the response from the server
    console.log(response.data);
  })
  .catch((error) => {
    // Handle errors
    console.error("Error:", error);
  });
