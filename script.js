var site = {
    input: null,
    init: function() {
        that = this;
        this.input = document.getElementById("input");
        
        document.body.addEventListener("keydown", function(e) {
            debug.addDebug(`Body: ${e.keyCode} | ${e.key}`);
        });
        document.body.addEventListener("input", function(e) {
            debug.addDebug(`Body+: ${e.data.charCodeAt(0)} | ${e.data}`);
        });
        this.input.addEventListener("keydown", function(e) {
            debug.addDebug(`Input: ${e.keyCode} | ${e.key}`);
        });
    },

}
var barcode = {
    _readBarcode: false,
    _readBarcodeString: [],
    _readBarcodeTimeout: 0,
    init: function () {
        var that = this;
        document.body.addEventListener("textInput", function(e) {
            if (e.data == "\\") {
                if (that._readBarcode == false)
                    that.startBarcode();
                else
                    that.endBarcode();

                debug.addDebug(`Found start ${that._readBarcode}`);

                e.preventDefault();
                e.stopPropagation();
            } else {
                if (that._readBarcode == true) {
                    that._readBarcodeString.push(e.data);
                    that.prolongBarcode();

                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        });
        document.body.addEventListener("keydown", function (e) {
            if (that.keyDown(e.keyCode)) {
                e.preventDefault();
                e.stopPropagation();
            } else {
                if (that._readBarcode == true) {
                    if (event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode >= 65 && event.keyCode <= 90)
                    {
                        that._readBarcodeString.push(e.key);
                        that.prolongBarcode();

                        e.preventDefault();
                        e.stopPropagation();
                    }
                }
            }
        }, false)
    },
    keyDown: function (keyCode) {
        switch (keyCode) {
            case 229:
                return true;
            
            case 220: //Backslash
                if (this._readBarcode == false)
                    this.startBarcode();
                else
                    this.endBarcode();
                return true;
        }

        return false;
    },
    startBarcode: function () {
        this._readBarcode = true;
        this._readBarcodeString = [];

        this.prolongBarcode();
    },
    prolongBarcode: function () {
        var that = this;

        window.clearTimeout(this._readBarcodeTimeout);
        this._readBarcodeTimeout = window.setTimeout(function () { that.endBarcode(); }, 5000);
    },
    endBarcode: function () {
        this._readBarcode = false;
        window.clearTimeout(this._readBarcodeTimeout);

        if (this._readBarcodeString.length == 0)
            return;

        var barcode = this._readBarcodeString.join("");
        debug.addDebug("Found barcode " + barcode);
    }
}

var debug = {
    element: null,
    init: function() {
        this.element = document.getElementById("debug");
    },
    addDebug: function(message)
    {
        this.element.innerHTML = `<div>${message}</div>${this.element.innerHTML}`;
    }
}
function checkLoaded() {
    return document.readyState === "complete";
}
alert(checkLoaded);
window.addEventListener("load", function() {
    debug.init();
    site.init();
    barcode.init();

    debug.addDebug("Website started");
});