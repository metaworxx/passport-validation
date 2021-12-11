const { Image, createCanvas } = require("canvas");
class PassportMRZ {
  constructor(canvas) {
    this.canvas = canvas ? canvas : require("canvas").createCanvas(600, 600);
    this.context = this.canvas.getContext("2d");
    this.imageElement = null;
  }
  getMRZ(imageBuffer, callback) {
    this.callback = callback;
    this.imageElement = new Image();
    this.imageElement.onload = this.onImageLoaded;
    this.imageElement.src = imageBuffer;
  }
  onImageLoaded = () => {
    this.imageToMRZ(this.imageElement, this.canvas, this.callback);
  };
  imageToMRZ = (image, canvas, callback, _newCanvas) => {
    const context = canvas.getContext("2d");
    const ratio = image.width / image.height;
    const width = canvas.width;
    const height = width / ratio;
    context.drawImage(image, 0, 0, width, height);
    console.log("width", width, 125);
    console.log("height", height, 23.2);
    const diff = width / 125;
    const mrzHeight = 23.2 * diff;
    context.beginPath();
    context.strokeStyle = "#FF0000";
    context.rect(0, height - mrzHeight, width, mrzHeight);
    context.stroke();

    const imageData = context.getImageData(
      0,
      height - mrzHeight,
      width,
      mrzHeight
    );

    const newCanvas = _newCanvas ? _newCanvas : createCanvas(width, mrzHeight);
    const newContext = newCanvas.getContext("2d");
    newCanvas.width = width;
    newCanvas.height = mrzHeight;
    newContext.putImageData(imageData, 0, 0);

    callback(_newCanvas ? _newCanvas : newCanvas.toBuffer());
  };
}

module.exports = PassportMRZ;
