var registry = require("./registry");
var language = require("./language");
var city = require("./city");
var currency = require("./currency");

Promise = require("promise");
require("whatwg-fetch");

language.load();

tabris.create("Drawer").append(tabris.create("PageSelector"));

city.checkSelectedCity(function (selectedCity) {
    currency.openCityCurrencies(selectedCity);
});

