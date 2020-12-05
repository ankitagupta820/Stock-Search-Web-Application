var express = require("express");
const { response } = require("express");
var Helper = require("./Helper");

/* Stock details Router */
var router = express.Router();

/* API for stock highlights*/
router.get("/highlights/:ticker", function (req, res, next) {
	let ticker = req.params.ticker;
	Helper.getStockHighlights(ticker).then((results) => {
		res.send(results);
	});
});

/* API for autocomplete suggestions */
router.get("/autocomplete/", function (req, res, next) {
	let query = req.query.ticker;
	Helper.autocomplete(query).then((results) => {
		res.send(results);
	});
});

/* Checks validity of ticker */
router.get("/ticker/:ticker", function (req, res, next) {
	let query = req.params.ticker;
	Helper.Validity(query).then((results) => {
		res.send(results);
	});
});

module.exports = router;
