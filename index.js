const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

app.use(express.json());


mongoose
	.connect(`${process.env.MONGODB}`, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(
		() => console.log("Connected to database"),
		(err) => console.log("Connection Failed", err)
	);

const Routes = require("./routes/index");
app.use("/api", Routes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "client/build")));
	app.get("*", function (req, res) {
		res.sendFile(path.join(__dirname, "client", "build", "index.html"));
	});
}

const port = process.env.PORT || 4000;
const serveHost = process.env.YOUR_HOST || "0.0.0.0";

app.listen(port, serveHost, () => {
	console.log(`Server running on ${port}`);
});

