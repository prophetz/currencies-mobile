Registry = function() {

    var data = {
        domain:'http://192.168.100.2'
    };

    this.set = function(key, value) {
        data[key] = value;
    };

    this.get = function(key) {
        if (data[key]) {
            return data[key];
        } else {
            return null;
        }
    };

};

module.exports = new Registry();