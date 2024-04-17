"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
// Define the URL of the endpoint
var url = "http://example.com/ml/route";
// Assuming you have a file to upload, you can create a FormData object
var formData = new FormData();
formData.append("file", file); // 'file' is the name of the file parameter expected by the server
// Make the Axios POST request
axios_1.default
    .post(url, formData, {
    headers: {
        "Content-Type": "multipart/form-data", // Ensure to set the correct content type for file uploads
    },
})
    .then(function (response) {
    // Handle the response from the server
    console.log(response.data);
})
    .catch(function (error) {
    // Handle errors
    console.error("Error:", error);
});
