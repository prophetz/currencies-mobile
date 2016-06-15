
STRINGS = (function() {
    var lang = tabris.device.get("language").replace(/-.*/, "");
    try {
        return require("./lang/" + lang + ".json");
    } catch (ex) {
        return require("./lang/en.json");
    }
}());

Promise = require("promise");
require("whatwg-fetch");

var moment = require('moment/min/moment-with-locales.min.js');
var LOCALE = tabris.device.get("language");
moment.locale(LOCALE);


tabris.create("Drawer").append(tabris.create("PageSelector"));

var page = tabris.create("Page", {
    title: STRINGS['page'].title,
    background: "#F2F2F2",
    topLevel: true
}).open();


drawHeader();


var view = tabris.create("CollectionView", {
    layoutData: {
        left: 0,
        top:  50,
        right: 0,
        bottom: 0
    },
    itemHeight: 50,
    refreshEnabled: true,
    initializeCell: function(cell) {

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


        cell.on("change:item", function(widget, item) {
            flagImage.set("image", {src: "./src/images/"+item.currency+".png"});
            currencyText.set("text", item.currency.toUpperCase());
            buyText.set("text", item.buy);
            sellText.set("text", item.sell);
            nbText.set("text", item.nb);
            if (item.currency == 'usd') {
                line.set('height', 0);
            }
        });
    }
}).on("refresh", function() {
    loadItems();
}).on("select", function(target, value) {
    createCurrencyPage(value.currency, false);
}).appendTo(page);


loadItems();

function createCurrencyPage(currency) {
    var page = tabris.create("Page", {
        title: currency.toUpperCase(),
        topLevel: false
    }).open();


}

function loadItems() {
    view.set({
        refreshIndicator: true,
        refreshMessage: "loading..."
    });
    fetch("http://85.143.217.30/exchange_rate/get").then(function(response) {
        var rates = JSON.parse(response._bodyInit);
        view.set({
            items: rates,
            refreshIndicator: false,
            refreshMessage: "refreshed"
        });

        page.set('title', STRINGS['page'].title + ' - ' + moment().format('LLL'));

    }).catch(function(error) {
        console.log('request failed:', error)
    })
}

function drawHeader() {
    var headerCell = tabris.create("Composite", {
        layoutData: {left: 0, top: 0, right: 0},
        background: "#BFBFBF",
        height: 50
    }).appendTo(page);

    tabris.create("TextView", {
        text: STRINGS['currencyHeader'].text,
        layoutData: {left: "5%", right: 0, top: 10},
        font: "18px Roboto, sans-serif"
    }).appendTo(headerCell);

    tabris.create("TextView", {
        text: STRINGS['buyHeader'].text,
        layoutData: {left: "30%", right: 0, top: 10},
        font: "18px Roboto, sans-serif"
    }).appendTo(headerCell);

    tabris.create("TextView", {
        text: STRINGS['sellHeader'].text,
        layoutData: {left: "55%", right: 0, top: 10},
        font: "18px Roboto, sans-serif"
    }).appendTo(headerCell);

    tabris.create("TextView", {
        text: STRINGS['nbHeader'].text,
        layoutData: {left: "80%", right: 0, top: 10},
        font: "18px Roboto, sans-serif"
    }).appendTo(headerCell);
}