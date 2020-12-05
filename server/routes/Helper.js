const axios = require("axios");
var moment = require("moment-timezone");
const { news_token, tingoo_token } = require("./constants");

module.exports.Validity = function validity(ticker) {
	let URL = `https://api.tiingo.com/tiingo/daily/${ticker}?token=${tingoo_token}`;

	return axios
		.get(URL)
		.then((resp) => {
			let response = resp.data;
			if (response.name) {
				return { Validity: true };
			}
		})
		.catch((error) => {
			if (error.response) {
				if (error.response.status == 404) {
					return { Validity: false };
				}
				console.log("Error Occured in Ticker Validity Check API");
			}
		});
};

module.exports.getStockHighlights = function getStockHighlights(ticker) {
	let one = `https://api.tiingo.com/tiingo/daily/${ticker}?token=${tingoo_token}`;
	let two = `https://api.tiingo.com/iex/?tickers=${ticker}&token=${tingoo_token}`;

	const promises = [axios.get(one), axios.get(two)];

	return axios
		.all(promises)
		.then(
			axios.spread((...responses) => {
				const resp_One = responses[0].data;
				const resp_Two = responses[1].data[0];

				let change = resp_Two.last - resp_Two.prevClose;
				var currentTimestamp = moment()
					.tz("America/Los_Angeles")
					.format("YYYY-MM-DD HH:mm:ss");
				var lastTimestamp = getTimestamp(resp_Two.timestamp);
				let marketStatus = getMarketStatus(resp_Two.timestamp);

				let results = {
					ticker: resp_One.ticker,
					name: resp_One.name,
					exchangeCode: resp_One.exchangeCode,
					last: resp_Two.last,
					change: change,
					changePercent: (change * 100) / resp_Two.prevClose,
					currentTimestamp: currentTimestamp,
					marketStatus: marketStatus,
					lastTimestamp: lastTimestamp,
				};
				return results;
			})
		)
		.catch((errors) => {
			if (errors.response) {
				console.log(
					`Highlights API failed. Error Status:  ${errors.response.status}`
				);
			} else {
				return { error: "Invalid ticker for Stock Highlights." };
			}
		});
};

function getTimestamp(date) {
	var date = new Date(date);
	var arr = date.toISOString().split("T");
	let timestamp = arr[0] + " " + arr[1].split(".")[0];
	return timestamp;
}

module.exports.getStockSummary = function getStockSummary(ticker) {
	return axios
		.get(`https://api.tiingo.com/iex/?tickers=${ticker}&token=${tingoo_token}`)
		.then((response) => {
			let resp = response.data[0];
			if (!resp) {
				return {};
			}
			let marketStatus = getMarketStatus(resp.timestamp);
			let results = {
				high: resp.high,
				low: resp.low,
				open: resp.open,
				close: resp.prevClose,
				volume: resp.volume,
				mid: resp.mid ? resp.mid : "-",
				askPrice: resp.askPrice,
				askSize: resp.askSize,
				bidPrice: resp.bidPrice,
				bidSize: resp.bidSize,
				marketStatus: marketStatus,
				change: resp.last - resp.prevClose,
			};

			return results;
		})
		.catch((error) => {
			if (error.response) {
				console.log(`Summary API failed. ${error.response.status}`);
			}
			return { error: "Invalid ticker for Stock Summary." };
		});
};

module.exports.getCompanyDetails = function getCompanyDetails(ticker) {
	return axios
		.get(`https://api.tiingo.com/tiingo/daily/${ticker}?token=${tingoo_token}`)
		.then((response) => {
			let results = {
				startDate: response.data.startDate,
				description: response.data.description,
			};

			return results;
		})
		.catch((error) => {
			if (error.response) {
				console.log(`Company details API failed. ${error.response.status}`);
			}
			return { error: "Invalid ticker for Company details." };
		});
};

module.exports.getLastChartData = function getLastChartData(ticker) {
	let timestamp_URL = `https://api.tiingo.com/iex/?tickers=${ticker}&token=${tingoo_token}`;
	let timestampPromise = axios.get(timestamp_URL);
	let chartPromise = timestampPromise
		.then((response) => {
			return response.data[0].timestamp;
		})
		.then((timestamp) => {
			let stamp = timestamp.split("T")[0];
			return axios.get(
				`https://api.tiingo.com/iex/${ticker}/prices?startDate=${stamp}&resampleFreq=4min&token=${tingoo_token}`
			);
		});

	return axios
		.all([timestampPromise, chartPromise])
		.then(
			axios.spread((...responses) => {
				results = {};

				const changeResponse = responses[0].data[0];
				results.change = changeResponse.last - changeResponse.prevClose;
				results.marketStatus = getMarketStatus(changeResponse.timestamp);

				const dataResponse = responses[1];
				dataArray = [];
				results.chart = dataResponse.data.map((instance) => {
					return [getEpoch(instance.date), instance.close];
				});
				return results;
			})
		)
		.catch((errors) => {
			if (errors.response) {
				console.log(
					`Daily Chart Data failed. Error Status:  ${errors.response.status}`
				);
			} else {
				return { error: "Invalid ticker for Stock Daily data." };
			}
		});
};

module.exports.getNews = function getNews(ticker) {
	let url = `https://newsapi.org/v2/everything?q=${ticker}&pageSize=30&apiKey=${news_token}`;
	return axios
		.get(url)
		.then((response) => {
			let items =
				response.data.totalResults > 30 ? 30 : response.data.totalResults;
			let i,
				counter = 0,
				results = [];
			let articles = response.data.articles;
			for (i = 0; i < items && counter < 20; i++) {
				if (articles[i].title && articles[i].urlToImage) {
					let date = convertDate(articles[i].publishedAt);
					articles[i].publishedAt = date;
					results.push(articles[i]);
					counter++;
				}
			}
			return results;
		})
		.catch((error) => {
			if (error.response) {
				console.log(`News API failed. ${error.response.status}`);
			}
			return { error: "Error encountered during fetching News" };
		});
};

module.exports.autocomplete = function autocomplete(query) {
	let url = `https://api.tiingo.com/tiingo/utilities/search?query=${query}&token=${tingoo_token}`;
	return axios
		.get(url)
		.then((response) => {
			return response.data
				.filter((suggestion) => suggestion.name != null)
				.map((suggestion) => {
					return {
						ticker: suggestion.ticker,
						name: suggestion.name,
					};
				});
		})
		.catch((error) => {
			if (error.response) {
				console.log(`Autocomplete API failed. ${error.response.status}`);
			}
			return {
				error: "Error encountered during fetching Autocomplete suggestions",
			};
		});
};

module.exports.getHistoricalChartData = function getLastChartData(ticker) {
	let date = moment().subtract(2, "year").format().split("T")[0];
	let URL = `https://api.tiingo.com/tiingo/daily/${ticker}/prices?startDate=${date}&resampleFreq=daily&token=${tingoo_token}`;
	return axios
		.get(URL)
		.then((response) => {
			results = { OHLC: [], Volume: [] };
			response.data.map((result) => {
				let timestamp = getEpoch(result.date);
				results.OHLC.push([
					timestamp,
					result.open,
					result.high,
					result.low,
					result.close,
				]);
				results.Volume.push([timestamp, result.volume]);
			});
			return results;
		})
		.catch((error) => {
			if (error.response) {
				console.log(
					`Historical Chart Data API failed. ${error.response.status}`
				);
			}
			return { error: "Error encountered during Last stock day chart data" };
		});
};

module.exports.getPortfolioInfo = function getPortfolioInfo(tickers) {
	return axios
		.get(`https://api.tiingo.com/iex/?tickers=${tickers}&token=${tingoo_token}`)
		.then((response) => {
			return response.data.map((detail) => {
				change = detail.last - detail.prevClose;
				changePercent = (change * 100) / detail.prevClose;
				return {
					ticker: detail.ticker,
					last: detail.last,
					change: change,
					changePercent: changePercent,
				};
			});
		})
		.catch((error) => {
			console.log("Portfolio API failed, Error: " + error);
		});
};

function convertDate(date) {
	let str = new moment(date);
	return str.format("LL");
}

function getEpoch(date) {
	let epoch = new Date(date).toLocaleString("en-US", {
		timeZone: "America/Los_Angeles",
	});
	return epoch - 0;
}

function getMarketStatus(lastTimestamp) {
	var diff = (new Date() - new Date(lastTimestamp)) / 1000;
	let marketStatus = diff > 60 ? 0 : 1;
	return marketStatus;
}
