// esitellään muuttujat ja valitaan elementit
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext("2d");
var imageData = null;
var numPixels = 0;
var pixels = null;
var addRed = document.querySelector('#addRed');
var addGreen = document.querySelector('#addGreen');
var addBlue = document.querySelector('#addBlue');
var lessRed = document.querySelector('#lessRed');
var lessGreen = document.querySelector('#lessGreen');
var lessBlue = document.querySelector('#lessBlue');
var autoC = document.querySelector('#autoContrast');
var bright = document.querySelector('input[name=kirkkaus]');
bright.value = 0;
var contrast = document.querySelector('input[name=kontrasti]');
contrast.value = 1;
var fileInput = document.querySelector('input[type=file]');

var image = new Image();
// image.src = "img/lowc.jpg";

// funktiot
var lataaKuva = function() {
    var reader = new FileReader();
    reader.addEventListener('load', function(evt) {
        image.src = this.result;
    });
    reader.readAsDataURL(this.files[0]);
}

var getMaxMin = function(array) {
    var values = {};
    var normalArray = Array.prototype.slice.call(array);
    normalArray.sort(function(a, b) {
        return a - b;
    });
    values.min = normalArray[0];

    normalArray.sort(function(a, b) {
        return b - a;
    });
    values.max = normalArray[0];
    return values;
};

var resetCanvas = function() {
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    pixels = imageData.data;
    numPixels = imageData.width * imageData.height;
};

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

var autoContrast = function() {
    /* Automaattinen kontrasti:
    Po = (P - mi)/(ma - mi) * 255
    P = Pikselin arvo
    mi = minimi
    ma = maksimi
    */
    var rArray = [];
    var gArray = [];
    var bArray = [];

    for (var i = 0; i < numPixels; i++) {
        rArray.push(pixels[i * 4]); // Red
        gArray.push(pixels[i * 4 + 1]); // Green
        bArray.push(pixels[i * 4 + 2]); // Blue
    };

    var maxMinR = getMaxMin(rArray);
    var maxMinG = getMaxMin(gArray);
    var maxMinB = getMaxMin(bArray);

    console.log(maxMinB);

    for (var i = 0; i < numPixels; i++) {
        pixels[i * 4] = ((pixels[i * 4] - maxMinR.min) / (maxMinR.max - maxMinR.min)) * 255; // Red
        pixels[i * 4 + 1] = ((pixels[i * 4 + 1] - maxMinG.min) / (maxMinG.max - maxMinG.min)) * 255; // Green
        pixels[i * 4 + 2] = ((pixels[i * 4 + 2] - maxMinB.min) / (maxMinB.max - maxMinB.min)) * 255; // Blue
    };
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(imageData, 0, 0);

}

var brightContrast = function() {
    /* Vaaleus/kontrasti:
    Po = (P - 128) * K + 128 + L
    P = pikselin arvo
    K = kontrasti (0-1 vähentää, 1-10 lisää)
    L = Vaalennus/tummennus (-255 - 255)
    */
    resetCanvas();

    var k = parseInt(contrast.value);
    var l = parseInt(bright.value);

    console.log((pixels[6 * 4] - 128) * k + 128 + l);

    for (var i = 0; i < numPixels; i++) {
        pixels[i * 4] = (pixels[i * 4] - 128) * k + 128 + l; // Red
        pixels[i * 4 + 1] = (pixels[i * 4 + 1] - 128) * k + 128 + l; // Green
        pixels[i * 4 + 2] = (pixels[i * 4 + 2] - 128) * k + 128 + l; // Blue
    };
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(imageData, 0, 0);

}

// tapahtumakuuntelijat
image.addEventListener('load', resetCanvas);
addRed.addEventListener('click', rgb);
addGreen.addEventListener('click', rgb);
addBlue.addEventListener('click', rgb);
lessRed.addEventListener('click', rgb);
lessGreen.addEventListener('click', rgb);
lessBlue.addEventListener('click', rgb);
autoC.addEventListener('click', autoContrast);
bright.addEventListener('change', brightContrast);
contrast.addEventListener('change', brightContrast);
fileInput.addEventListener('change', lataaKuva);