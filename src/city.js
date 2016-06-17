var registry = require("./registry");
var language = require("./language");

var City = function () {

    var self = this;

    this.load = function (callback) {

        console.log(registry.get('domain'));

        fetch(registry.get('domain') + "/cities/get").then(function (response) {

            var cities = JSON.parse(response._bodyInit);

            var items = [];
            items.push({name: 'Выберите город', type: "section"});
            for (var i = 0; i < cities.length; i++) {
                items.push({name: cities[i], type: "item"});
            }

            callback(items);

        }).catch(function (error) {
            console.log('request failed:', error)
        });
    };

    this.checkSelectedCity = function () {
        var selectedCity = localStorage.getItem('city');

        if (selectedCity == null) {

            self.load(function (cities) {

                var selectCityPage = tabris.create("Page", {
                    title: language.getString('selectCityPage', 'title'),
                    background: "#F2F2F2",
                    topLevel: true
                });

                new tabris.TextView({
                    layoutData: {left: 10, top: "prev() 10", right: 10},
                    text: "Выберите, пожалуйста, ваш город:",
                    alignment: "center"
                }).appendTo(selectCityPage);

                new tabris.CollectionView({
                    layoutData: {left: 0, top: 0, right: 0, bottom: 0},
                    items: cities,
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
                }).appendTo(selectCityPage);

                selectCityPage.open();
            });
        }
    }
};


module.exports = new City();