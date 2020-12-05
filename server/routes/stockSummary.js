var express = require("express");
const { response } = require("express");
var Helper = require("./Helper");

/* Stock summary Router */
var router = express.Router();

/* API for stock Summary*/
router.get("/:ticker", function (req, res, next) {
	let ticker = req.params.ticker;
	Helper.getStockSummary(ticker).then((results) => {
		res.send(results);
	});
});

/* API for stock Company description*/
router.get("/company/:ticker", function (req, res, next) {
	let ticker = req.params.ticker;
	Helper.getCompanyDetails(ticker).then((results) => {
		res.send(results);
	});
});

/* API for Chart-Last Working Day data*/
router.get("/chart/:ticker", function (req, res, next) {
	let ticker = req.params.ticker;
	Helper.getLastChartData(ticker).then((results) => {
		res.send(results);
	});
});

module.exports = router;
