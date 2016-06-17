Language = function () {

    this.lang = 'en';
    this.strings = {};
    this.stringsCount = 0;
    var self = this;

    this.load = function () {

        self.checkLang();

        strings = (function () {
            try {
                return require("./lang/" + self.getLang() + ".json");
            } catch (ex) {
                return require("./lang/" + self.getLang() + ".json");
            }
        }());

        self.strings = strings;
        self.stringsCount = strings.length;
    };

    this.checkLang = function () {
        var lang = tabris.device.get("language").replace(/-.*/, "");
        self.setLang(lang);
    };

    this.setLang = function (lang) {
        self.lang = lang;
    };

    this.getLang = function () {
        return self.lang;
    };

    this.getString = function (name, subName) {
        if (subName != null) {
            try {
                return self.strings[name][subName];
            } catch (e) {
                console.log('language error: unknown keys ' + name + ' ' + subName)
            }
        } else {
            try {
                return self.strings[name];
            } catch (e) {
                console.log('language error: unknown key ' + name)
            }
        }
    };

    this.getLocale = function () {
        return tabris.device.get("language");
    };

};

module.exports = new Language();