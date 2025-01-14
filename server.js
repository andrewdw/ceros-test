const express = require("express");
const path = require("path");
const port = process.env.PORT || 8080;
const app = express();

// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname + "/dist"));

// all routes to index.html
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// listen without explicitly specifying host, as per DO best practices
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
