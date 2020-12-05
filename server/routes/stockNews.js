var express = require("express");
var Helper = require("./Helper");

/* Stock News Router */
var router = express.Router();

/* API for stock News*/
router.get("/:ticker", function (req, res, next) {
	let ticker = req.params.ticker;
	Helper.getNews(ticker).then((results) => {
		res.send(results);
	});
});

module.exports = router;
