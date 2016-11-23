// esitellään muuttujat
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext("2d");
var imageData = null;
var numPixels = 0;
var pixels = null;

var image = new Image();
image.src = "img/teht_a.jpg";
image.addEventListener('load', function() {
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    pixels = imageData.data;
    numPixels = imageData.width * imageData.height;
});

var rgb = function() {
    var r = 0;
    var g = 0;
    var b = 0;

    if (this.id.indexOf('Red') !== -1) { // jos sisältää sanan Red
        r = parseInt(this.value);
    } else if (this.id.indexOf('Green') !== -1) { // jos sisältää sanan Green
        g = parseInt(this.value);
    } else {
        b = parseInt(this.value);
    }

    for (var i = 0; i < numPixels; i++) {
        pixels[i * 4] = pixels[i * 4] + r; // Red
        pixels[i * 4 + 1] = pixels[i * 4 + 1] + g; // Green
        pixels[i * 4 + 2] = pixels[i * 4 + 2] + b; // Blue
    };
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(imageData, 0, 0);
}

var addRed = document.querySelector('#addRed');
var addGreen = document.querySelector('#addGreen');
var addBlue = document.querySelector('#addBlue');
var lessRed = document.querySelector('#lessRed');
var lessGreen = document.querySelector('#lessGreen');
var lessBlue = document.querySelector('#lessBlue');
addRed.addEventListener('click', rgb);
addGreen.addEventListener('click', rgb);
addBlue.addEventListener('click', rgb);
lessRed.addEventListener('click', rgb);
lessGreen.addEventListener('click', rgb);
lessBlue.addEventListener('click', rgb);