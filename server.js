const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app"); // Correct path to the app.js file
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
