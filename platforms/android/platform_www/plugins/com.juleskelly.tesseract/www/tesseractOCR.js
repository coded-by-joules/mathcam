cordova.define("com.juleskelly.tesseract.TesseractOCR", function(require, exports, module) { var tesseractOCR = {
  // loads the train data
  load: function (callback, errcallback) {
    cordova.exec(
      callback,             // success callback
      errcallback,
      "TesseractOCR",       // class name
      "loadEngine",         // method name
      []
    );
  },

  // recognizes the image
  recognizeImage: function (imageURL, callback) {
    cordova.exec(
      callback,
      function (err) {
        callback(err);
      },
      "TesseractOCR",
      "recognizeImage",
      [{
        "imageURL": imageURL
      }]
    );
  }
};

module.exports = tesseractOCR;


});
