var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var stockHighlights = require("./routes/stockHighlights");
var stockSummary = require("./routes/stockSummary");
var stockNews = require("./routes/stockNews");
var stockCharts = require("./routes/stockCharts");
var stockPortfolio = require("./routes/stockPortfolio");
var cors = require("cors");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/", stockHighlights);
app.use("/summary", stockSummary);
app.use("/news", stockNews);
app.use("/charts", stockCharts);
app.use("/portfolio", stockPortfolio);
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

var port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});

//module.exports = app;
