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
    const ratio = this.imageElement.width / this.imageElement.height;
    const width = this.canvas.width;
    const height = width / ratio;
    this.context.drawImage(this.imageElement, 0, 0, width, height);
    console.log("width", width, 125);
    console.log("height", height, 23.2);
    const diff = width / 125;
    const mrzHeight = 23.2 * diff;
    this.context.beginPath();
    this.context.strokeStyle = "#FF0000";
    this.context.rect(0, height - mrzHeight, width, mrzHeight);
    this.context.stroke();

    const imageData = this.context.getImageData(
      0,
      height - mrzHeight,
      width,
      mrzHeight
    );

    const newCanvas = createCanvas(width, mrzHeight);
    const newContext = newCanvas.getContext("2d");
    newCanvas.width = width;
    newCanvas.height = mrzHeight;
    newContext.putImageData(imageData, 0, 0);

    this.callback(newCanvas.toBuffer());
  };
}

module.exports = PassportMRZ;
