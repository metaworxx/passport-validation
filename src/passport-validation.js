const PassportImageValidation = require("./passport-image-validation");
const PassportMRZ = require("./passport-mrz");
const moment = require("moment");

class PassportValidation {
  constructor(info) {
    this.info = info;
  }
  async process() {
    return new Promise((resolve) => {
      const passportMRZ = new PassportMRZ();
      passportMRZ.getMRZ(this.info.image, (mrzBuffer) => {
        const passportValidation = new PassportImageValidation();
        passportValidation.process({
          image: mrzBuffer,
          success: (result) => this.checkDetails(result, resolve),
        });
      });
    });
  }
  sendResponse(hasPassed, message, result, callback) {
    callback({
      result,
      message,
      passed: hasPassed,
    });
  }
  checkDetails = (result, resolve) => {
    console.log(result);
    //is this a passport doc
    if (result.document.toLowerCase().trim() === "p") {
      //if the passport number correct
      if (
        result.passportNumber.toLowerCase().trim() ===
        this.info.passportNumber.toLowerCase().trim()
      ) {
        //check if passport has expired
        //	Date of birth (YYMMDD)
        const expiry = result.expiryDateOfPassport;
        const expiryDate = moment(expiry, "YYMMDD");
        const dateNow = moment();
        const isGreaterThanNow = !!expiryDate.diff(dateNow);

        if (isGreaterThanNow) {
          //check dob
          const dobDate = moment(this.info.dob, "DDMMYYYY");
          const passportDobDate = moment(result.dob, "YYMMDD");
          if (dobDate.isSame(passportDobDate)) {
            this.sendResponse(true, "passed", result, resolve);
          } else {
            this.sendResponse(false, "DOB incorrect", result, resolve);
          }
        } else {
          this.sendResponse(false, "passport expired", result, resolve);
        }
      } else {
        this.sendResponse(false, "passport number incorrect", result, resolve);
      }
    } else {
      this.sendResponse(false, "incorrect document", result, resolve);
    }
  };
}
module.exports = PassportValidation;
