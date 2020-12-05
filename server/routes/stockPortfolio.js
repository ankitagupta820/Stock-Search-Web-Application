var express = require("express");
const { response } = require("express");
var Helper = require("./Helper");

var router = express.Router();

router.get("/", function (req, res, next) {
	let tickers = req.query.tickers;
	Helper.getPortfolioInfo(tickers).then((results) => {
		res.send(results);
	});
});

module.exports = router;
