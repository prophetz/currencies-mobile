var registry = require("./registry");
var language = require("./language");
var currency = require("./currency");

var City = function () {

    var self = this;

    this.selectCityPage = null;
    this.citiesList = null;

    this.load = function (callback) {

        console.log('city.load');

        fetch(registry.get('domain') + "/city/get").then(function (response) {

            var cities = JSON.parse(response._bodyInit);

            var items = [];
            for (var i = 0; i < cities.length; i++) {
                if (cities[i].type == 'region') {
                    items.push({name: cities[i].name, type: "section"});
                } else {
                    items.push({name: cities[i].name, type: "item", alt_name: cities[i].altName, id: cities[i].id});
                }
            }

            callback(items);

        }).catch(function (error) {
            console.log('request failed:', error)
        });
    };

    this.checkSelectedCity = function (callback) {

        console.log('city.checkSelectedCity');

        self.createSelectCityPage();

        var selectedCity = localStorage.getItem('city');

        //selectedCity = null;

        if (selectedCity == null) {

            self.selectCityPage.open();

            self.load(function (cities) {
                self.citiesList.insert(cities);
            });

        } else {
            callback();
        }
    };

    this.createSelectCityPage = function () {

        self.selectCityPage = tabris.create("Page", {
            title: language.getString('selectCityPage', 'title'),
            background: "#F2F2F2",
            topLevel: true
        }).on("appear", function () {
            self.load(function (cities) {
                self.citiesList.insert(cities);
            });
        });

        self.citiesList = new tabris.CollectionView({
            layoutData: {left: 0, top: 0, right: 0, bottom: 0},
            cellType: function (item) {
                return item.type;
            },
            itemHeight: function (item, type) {
                return type === "section" ? 48 : 48;
            },
            initializeCell: function (cell, type) {
                var textView = new tabris.TextView({
                    layoutData: {top: 2, bottom: 2, left: 5, right: 5},
                    font: type === "section" ? "bold 28px" : "28px",
                    alignment: type === "section" ? "center" : "center"
                }).appendTo(cell);
                if (type === "section") {
                    cell.set("background", "#cecece");
                }
                cell.on("change:item", function (widget, item) {
                    textView.set("text", item.name);
                });
            }
        }).on("select", function (target, value) {
            localStorage.setItem('city', JSON.stringify(value));
            if (currency.page != null) {
                currency.page.close();
            }
            currency.openCityCurrencies(value);
        }).appendTo(self.selectCityPage);
    }
};

module.exports = new City();