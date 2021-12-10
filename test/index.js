const { readFileSync } = require("fs");
const { resolve } = require("path");
const PassportValidation = require("..");
const PassportImageValidation = require("../src/passport-image-validation");
const PassportMRZ = require("../src/passport-mrz");

//get an image
const base64Image = readFileSync(resolve("demo/images/2.jpg"));

(async () => {
  const passportValidation = new PassportValidation({
    image: base64Image,
    passportNumber: "ks0000461",
    dob: "08011980",
  });
  const result = await passportValidation.process();
  console.log(result);
})();
