var express = require('express');
const { response } = require('express');
var Helper = require('./Helper');

/* Stock details Router */
var router = express.Router();

/* API for stock historical data chart */
router.get('/:ticker', function (req, res, next) {
    let ticker = req.params.ticker
    Helper.getHistoricalChartData(ticker)
        .then(results => {
            res.send(results)
        });
});


module.exports = router;
