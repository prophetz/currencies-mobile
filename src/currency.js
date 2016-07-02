var language = require("./language");
var registry = require("./registry");
var moment = require('moment/min/moment-with-locales.min.js');
moment.locale(language.getLocale());

Currency = function () {

    var self = this;
    this.page = null;
    this.view = null;
    this.header = null;


    this.load = function () {

        console.log('currency.load');

        self.view.set({
            refreshIndicator: true,
            refreshMessage: "loading..."
        });

        var city = JSON.parse(localStorage.getItem('city'));

        fetch(registry.get('domain') + "/exchange_rate/get?city_id=" + city.id + "&best=1").then(function (response) {
            
            var rates = JSON.parse(response._bodyInit);

            self.view.set({
                items: rates,
                refreshIndicator: false,
                refreshMessage: "refreshed"
            });

            self.page.set('title', language.getString('page', 'title') + ' - ' + moment().format('LLL'));

        }).catch(function (error) {
            console.log('request failed:', error)
        })
    };

    this.openCityCurrencies = function () {

        console.log('currency.openCityCurrencies');

        self.page = tabris.create("Page", {
            title: language.getString('page', 'title'),
            background: "#F2F2F2",
            topLevel: true
        });

        self.header = tabris.create("Composite", {
            layoutData: {left: 0, top: 0, right: 0},
            background: "#BFBFBF",
            height: 50
        }).appendTo(self.page);

        tabris.create("TextView", {
            text: language.getString('currencyHeader', 'text'),
            layoutData: {left: "5%", right: 0, top: 10},
            font: "18px Roboto, sans-serif"
        }).appendTo(self.header);

        tabris.create("TextView", {
            text: language.getString('buyHeader', 'text'),
            layoutData: {left: "30%", right: 0, top: 10},
            font: "18px Roboto, sans-serif"
        }).appendTo(self.header);

        tabris.create("TextView", {
            text: language.getString('sellHeader', 'text'),
            layoutData: {left: "55%", right: 0, top: 10},
            font: "18px Roboto, sans-serif"
        }).appendTo(self.header);

        tabris.create("TextView", {
            text: language.getString('nbHeader', 'text'),
            layoutData: {left: "80%", right: 0, top: 10},
            font: "18px Roboto, sans-serif"
        }).appendTo(self.header);

        self.view = tabris.create("CollectionView", {
            layoutData: {
                left: 0,
                top: 50,
                right: 0,
                bottom: 0
            },
            itemHeight: 50,
            refreshEnabled: true,
            initializeCell: function (cell) {

                var flagImage = tabris.create("ImageView", {
                    layoutData: {height: 24, width: 45, left: "5%", top: 16},
                    background: "#F2F2F2",
                    scaleMode: 'auto'
                }).appendTo(cell);

                var currencyText = tabris.create("TextView", {
                    layoutData: {left: [flagImage, 16], top: 11, right: 16},
                    alignment: "left",
                    font: "24px Roboto, sans-serif",
                    textColor: "#000"
                }).appendTo(cell);

                var buyText = tabris.create("TextView", {
                    layoutData: {left: "30%", top: 10, right: 10},
                    alignment: "left",
                    font: "24px Roboto, sans-serif",
                    textColor: "#000"
                }).appendTo(cell);

                var sellText = tabris.create("TextView", {
                    layoutData: {left: "55%", top: 10, right: 10},
                    alignment: "left",
                    font: "24px Roboto, sans-serif",
                    textColor: "#000"
                }).appendTo(cell);

                var nbText = tabris.create("TextView", {
                    layoutData: {left: "80%", top: 10, right: 10},
                    alignment: "left",
                    font: "24px Roboto, sans-serif",
                    textColor: "#000"
                }).appendTo(cell);

                var line = tabris.create("Composite", {
                    layoutData: {left: "2%", top: 0, right: "2%"},
                    background: "#858585",
                    height: 1
                }).appendTo(cell);


                cell.on("change:item", function (widget, item) {
                    flagImage.set("image", {src: "./src/images/" + item.currency + ".png"});
                    currencyText.set("text", item.currency.toUpperCase());
                    buyText.set("text", item.buy);
                    sellText.set("text", item.sell);
                    nbText.set("text", item.nbrb);
                    if (item.currency == 'usd') {
                        line.set('height', 0);
                    }
                });
            }
        }).on("refresh", function () {
            self.load();
        }).on("select", function (target, value) {
            self.createCurrencyPage(value.currency, false);
        }).appendTo(self.page);

        self.page.open();

        self.load();
    };

    this.createCurrencyPage = function (currency) {

        var page = tabris.create("Page", {
            title: currency.toUpperCase(),
            topLevel: false
        }).open();

        /*
         fetch("http://192.168.100.2/currency/"+currency).then(function(response) {
         console.log(response);
         var rates = JSON.parse(response._bodyInit);



         }).catch(function(error) {
         console.log('request failed:', error)
         })

         */
    }

};

module.exports = new Currency();