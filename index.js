const PassportMRZ = require("./src/passport-mrz");
const PassportValidation = require("./src/passport-validation");
const PassportImageValidation = require("./src/passport-image-validation");

module.exports = {
  PassportValidation: PassportValidation,
  PassportMRZ: PassportMRZ,
  PassportImageValidation: PassportImageValidation,
};
