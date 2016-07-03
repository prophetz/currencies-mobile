var language = require("./language");
var registry = require("./registry");
var moment = require('moment/min/moment-with-locales.min.js');
moment.locale(language.getLocale());

Currency = function () {

    var self = this;
    this.cityCurrenciesPage = null;
    this.bankCurrenciesPage = null;
    this.cityCurrencyPage = null;
    this.cityCurrenciesView = null;
    this.bankCurrenciesView = null;
    this.cityCurrencyView = null;
    this.cityCurrenciesHeader = null;
    this.bankCurrenciesHeader = null;
    this.cityCurrencyHeader = null;


    this.loadBankCurrencies = function (bank_alt, currency) {

        console.log('currency.loadBankCurrencies');

        self.bankCurrenciesView.set({
            refreshIndicator: true,
            refreshMessage: "loading..."
        });

        var city = JSON.parse(localStorage.getItem('city'));

        fetch(registry.get('domain') + "/exchange_rate/get?city_id=" + city.id + "&bank=" + bank_alt + "&currency=" + currency).then(function (response) {

            var rates = JSON.parse(response._bodyInit);

            self.bankCurrenciesView.set({
                items: rates,
                refreshIndicator: false,
                refreshMessage: "refreshed"
            });

        }).catch(function (error) {
            console.log('request failed:', error)
        })
    };

    this.loadCityCurrencies = function () {

        console.log('currency.loadCityCurrencies');

        self.cityCurrenciesView.set({
            refreshIndicator: true,
            refreshMessage: "loading..."
        });

        var city = JSON.parse(localStorage.getItem('city'));

        fetch(registry.get('domain') + "/exchange_rate/get?city_id=" + city.id + "&best=1").then(function (response) {

            var rates = JSON.parse(response._bodyInit);

            self.cityCurrenciesView.set({
                items: rates,
                refreshIndicator: false,
                refreshMessage: "refreshed"
            });

            self.cityCurrenciesPage.set('title', language.getString('page', 'title') + ' - ' + moment().format('LLL'));

        }).catch(function (error) {
            console.log('request failed:', error)
        })
    };

    this.loadCityCurrency = function (currency) {

        console.log('currency.loadCityCurrency');

        self.cityCurrencyView.set({
            refreshIndicator: true,
            refreshMessage: "loading..."
        });

        var city = JSON.parse(localStorage.getItem('city'));

        fetch(registry.get('domain') + "/exchange_rate/get?city_id=" + city.id + "&currency=" + currency).then(function (response) {

            console.log(registry.get('domain') + "/exchange_rate/get?city_id=" + city.id + "&currency=" + currency);
            var rates = JSON.parse(response._bodyInit);

            self.cityCurrencyView.set({
                items: rates,
                refreshIndicator: false,
                refreshMessage: "refreshed"
            });

        }).catch(function (error) {
            console.log('request failed:', error)
        })
    };

    this.openCityCurrencies = function () {

        console.log('currency.openCityCurrencies');

        self.cityCurrenciesPage = tabris.create("Page", {
            title: language.getString('page', 'title'),
            background: "#F2F2F2",
            topLevel: true
        });

        self.cityCurrenciesHeader = tabris.create("Composite", {
            layoutData: {left: 0, top: 0, right: 0},
            background: "#BFBFBF",
            height: 50
        }).appendTo(self.cityCurrenciesPage);

        tabris.create("TextView", {
            text: language.getString('currencyHeader', 'text'),
            layoutData: {left: "5%", right: 0, top: 10},
            font: "18px Roboto, sans-serif"
        }).appendTo(self.cityCurrenciesHeader);

        tabris.create("TextView", {
            text: language.getString('buyHeader', 'text'),
            layoutData: {left: "30%", right: 0, top: 10},
            font: "18px Roboto, sans-serif"
        }).appendTo(self.cityCurrenciesHeader);

        tabris.create("TextView", {
            text: language.getString('sellHeader', 'text'),
            layoutData: {left: "55%", right: 0, top: 10},
            font: "18px Roboto, sans-serif"
        }).appendTo(self.cityCurrenciesHeader);

        tabris.create("TextView", {
            text: language.getString('nbHeader', 'text'),
            layoutData: {left: "80%", right: 0, top: 10},
            font: "18px Roboto, sans-serif"
        }).appendTo(self.cityCurrenciesHeader);

        self.cityCurrenciesView = tabris.create("CollectionView", {
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
            self.loadCityCurrencies();
        }).on("select", function (target, value) {
            self.openCityCurrency(value.currency);
        }).appendTo(self.cityCurrenciesPage);

        self.cityCurrenciesPage.open();

        self.loadCityCurrencies();
    };

    this.openCityCurrency = function (currency) {

        console.log('currency.openCityCurrency');

        var city = JSON.parse(localStorage.getItem('city'));

        self.cityCurrencyPage = tabris.create("Page", {
            title: 'Курс ' + currency.toUpperCase() + ' в г. ' + city.name,
            background: "#F2F2F2",
            topLevel: true
        });

        self.cityCurrencyHeader = tabris.create("Composite", {
            layoutData: {left: 0, top: 0, right: 0},
            background: "#BFBFBF",
            height: 50
        }).appendTo(self.cityCurrencyPage);

        tabris.create("TextView", {
            text: language.getString('bankHeader', 'text'),
            layoutData: {left: "5%", right: 0, top: 10},
            font: "18px Roboto, sans-serif"
        }).appendTo(self.cityCurrencyHeader);

        tabris.create("TextView", {
            text: language.getString('buyHeader', 'text'),
            layoutData: {left: "60%", right: 0, top: 10},
            font: "18px Roboto, sans-serif"
        }).appendTo(self.cityCurrencyHeader);

        tabris.create("TextView", {
            text: language.getString('sellHeader', 'text'),
            layoutData: {left: "85%", right: 0, top: 10},
            font: "18px Roboto, sans-serif"
        }).appendTo(self.cityCurrencyHeader);

        self.cityCurrencyView = tabris.create("CollectionView", {
            layoutData: {
                left: 0,
                top: 50,
                right: 0,
                bottom: 0
            },
            itemHeight: 50,
            refreshEnabled: true,
            initializeCell: function (cell) {


                var bankImage = tabris.create("ImageView", {
                    layoutData: {height: 40, width: 40, left: "3%", top: 5},
                    //background: "#F2F2F2",
                    scaleMode: 'auto'
                }).appendTo(cell);


                var currencyText = tabris.create("TextView", {
                    layoutData: {left: [bankImage, 16], top: 11, right: 16},
                    alignment: "left",
                    font: "24px Roboto, sans-serif",
                    textColor: "#000"
                }).appendTo(cell);

                var buyText = tabris.create("TextView", {
                    layoutData: {left: "60%", top: 10, right: 10},
                    alignment: "left",
                    font: "24px Roboto, sans-serif",
                    textColor: "#000"
                }).appendTo(cell);

                var sellText = tabris.create("TextView", {
                    layoutData: {left: "85%", top: 10, right: 10},
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
                    bankImage.set("image", {src: "./src/images/banks/" + item.bank_alt + ".png"});
                    currencyText.set("text", item.bank);
                    buyText.set("text", item.buy);
                    sellText.set("text", item.sell);
                    if (cell._props.itemIndex == 0) {
                        line.set('height', 0);
                    }
                });
            }
        }).on("refresh", function () {
            self.loadCityCurrency(currency);
        }).on("select", function (target, value) {
            console.log(value);
            self.openBankCurrencies(value, currency);
        }).appendTo(self.cityCurrencyPage);

        self.cityCurrencyPage.open();

        self.loadCityCurrency(currency);
    };

    this.openBankCurrencies = function (bank, currency) {

        console.log('currency.openBankCurrencies');
        console.log(bank);

        var city = JSON.parse(localStorage.getItem('city'));

        self.bankCurrenciesPage = tabris.create("Page", {
            title: 'Курсы ' + bank.bank,
            background: "#F2F2F2",
            topLevel: true
        });

        self.bankCurrenciesHeader = tabris.create("Composite", {
            layoutData: {left: 0, top: 0, right: 0},
            background: "#BFBFBF",
            height: 50
        }).appendTo(self.bankCurrenciesPage);

        tabris.create("TextView", {
            text: language.getString('officeHeader', 'text'),
            layoutData: {left: "5%", right: 0, top: 10},
            font: "18px Roboto, sans-serif"
        }).appendTo(self.bankCurrenciesHeader);

        tabris.create("TextView", {
            text: language.getString('buyHeader', 'text'),
            layoutData: {left: "60%", right: 0, top: 10},
            font: "18px Roboto, sans-serif"
        }).appendTo(self.bankCurrenciesHeader);

        tabris.create("TextView", {
            text: language.getString('sellHeader', 'text'),
            layoutData: {left: "85%", right: 0, top: 10},
            font: "18px Roboto, sans-serif"
        }).appendTo(self.bankCurrenciesHeader);

        self.bankCurrenciesView = tabris.create("CollectionView", {
            layoutData: {
                left: 0,
                top: 50,
                right: 0,
                bottom: 0
            },
            itemHeight: 95,
            refreshEnabled: true,
            initializeCell: function (cell) {

                var officeName = tabris.create("TextView", {
                    layoutData: {left: "5%", top: 11, right: 16},
                    alignment: "left",
                    font: "18px Roboto, sans-serif",
                    textColor: "#000"
                }).appendTo(cell);

                var officePhone = tabris.create("TextView", {
                    layoutData: {left: "5%", top: [officeName, 5], right: 16},
                    alignment: "left",
                    font: "14px Roboto, sans-serif",
                    textColor: "#000"
                }).appendTo(cell);

                var officeAddress = tabris.create("TextView", {
                    layoutData: {left: "5%", top: [officePhone, 5], right: 16},
                    alignment: "left",
                    font: "14px Roboto, sans-serif",
                    textColor: "#000"
                }).appendTo(cell);

                var buyText = tabris.create("TextView", {
                    layoutData: {left: "60%", top: 10, right: 10},
                    alignment: "left",
                    font: "24px Roboto, sans-serif",
                    textColor: "#000"
                }).appendTo(cell);

                var sellText = tabris.create("TextView", {
                    layoutData: {left: "85%", top: 10, right: 10},
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
                    console.log(item);
                    officeName.set("text", item.name);
                    officePhone.set("text", item.phone);
                    officeAddress.set("text", item.address);
                    buyText.set("text", item.buy);
                    sellText.set("text", item.sell);
                    if (cell._props.itemIndex == 0) {
                        line.set('height', 0);
                    }
                });
            }
        }).on("refresh", function () {
            self.loadBankCurrencies(bank.bank_alt, currency);
        }).on("select", function (target, value) {
            console.log(value);
            //self.openCityCurrency(value.currency);
        }).appendTo(self.bankCurrenciesPage);

        self.bankCurrenciesPage.open();

        self.loadBankCurrencies(bank.bank_alt, currency);
    }

};

module.exports = new Currency();