/*var canvas = document.querySelector('canvas')
var ctx = canvas.getContext('2d');
ctx.fillStyle = 'black';

var DrawPixel = function (x, y) {
  ctx.fillRect(x, y, 1, 1);
}

var DrawCirle = function (x0, y0, radius) {
  var x = radius;
  var y = 0;
  var radiusError = 1 - x;
  i=1;
  while (x >= y) {
  	console.log("loop " + i + " ==============================================")
    DrawPixel(x + x0, y + y0); 		console.log((x + x0) +", "+ (y + y0));
    DrawPixel(y + x0, x + y0); 		console.log((y + x0) +", "+ (x + y0));
    DrawPixel(-x + x0, y + y0); 	console.log((-x + x0) +", "+ (y + y0));
    DrawPixel(-y + x0, x + y0); 	console.log((-y + x0) +", "+ (x + y0));
    DrawPixel(-x + x0, -y + y0); 	console.log((-x + x0) +", "+ (-y + y0));
    DrawPixel(-y + x0, -x + y0); 	console.log((-y + x0) +", "+ (-x + y0));
    DrawPixel(x + x0, -y + y0); 	console.log((x + x0) +", "+ (-y + y0));
    DrawPixel(y + x0, -x + y0); 	console.log((y + x0) +", "+ (-x + y0));
    y++;
    i++;
    if (radiusError < 0) {
        radiusError += 2 * y + 1;
    }
    else {
        x--;
        radiusError+= 2 * (y - x + 1);
    }
  }
};

DrawCirle(50, 50, 100)*/



"use strict";

var maxDiameter = 64;
var firstFrameEmpty = true;

var frameCount = maxDiameter + (firstFrameEmpty ? 1 : 0);

var canvas = document.createElement('canvas');
canvas.width = maxDiameter * frameCount;
canvas.height = maxDiameter;
var context = canvas.getContext('2d');
var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
var pixelData = imageData.data;
var makePixelIndexer = function(width){
    return function(i,j){
        var index = j*(width*4) + i*4;
        //index points to the R chanel of pixel
        //at column i and row j calculated from top left
        return index;
    };
}
var pixelIndexer = makePixelIndexer(canvas.width);
var drawPixel = function(x,y){
    var idx = pixelIndexer(x,y);
    pixelData[idx] = 255;   //red
    pixelData[idx+1] = 0;   //green
    pixelData[idx+2] = 255;//blue
    pixelData[idx+3] = 255;//alpha
};

var distance = function( x, y ) {
    return Math.sqrt((Math.pow(y, 2)) + Math.pow(x, 2));
};

var filled = function( x, y, radius ) {
    return distance(x, y) <= radius;
};

for(var i=0; i<frameCount; i++) {
    var diameter = i + (!firstFrameEmpty ? 1 : 0);;
    var radius = parseFloat(diameter) / 2;

    var maxblocks_x, maxblocks_y;

    if( (radius * 2) % 2 == 0 ) {
        maxblocks_x = Math.ceil(radius - 0.5) * 2 + 1;
        maxblocks_y = Math.ceil(radius - 0.5) * 2 + 1;
    } else {
        maxblocks_x = Math.ceil(radius) * 2;
        maxblocks_y = Math.ceil(radius) * 2;
    }

    for( var y = -maxblocks_y / 2 + 1; y <= maxblocks_y / 2 - 1; y++ ) {
        for( var x = -maxblocks_x / 2 + 1; x <= maxblocks_x / 2 - 1; x++ ) {
            var xfilled = filled(x, y, radius);
            if(xfilled) {
                var nudge = (radius * 2) % 2 == 0 ? 0.5 : 0;
                drawPixel(
                    x + maxDiameter/2 - nudge + (i * maxDiameter),
                    y + maxDiameter/2 - nudge
                );
            }
        }
    }
}

context.putImageData(imageData,0,0);
console.log(canvas.toDataURL());

