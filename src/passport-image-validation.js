const { createWorker } = require("tesseract.js");
const path = require("path");

class PassportImageValidation {
  constructor(base64Image) {
    this.base64Image = base64Image;
  }
  process(info) {
    const worker = createWorker({
      logger: (m) => console.log(m),
    });

    (async () => {
      await worker.load();
      await worker.loadLanguage("eng");
      await worker.initialize("eng");
      console.log("Recognizing...");
      const {
        data: { text },
      } = await worker.recognize(info.image);
      this.validatePassportMRZ(text, info.success);
      await worker.terminate();
    })();
  }
  validatePassportMRZ(text, success) {
    const parts = {
      document: text[0],
      documentType: text[1] !== "<" ? text[1] : undefined,
      issuer: text.substring(2, 5),
    };
    const names = text.substring(5, 44);
    const doubleArrowSplit = names.split("<<");
    parts.surname = doubleArrowSplit[0];
    parts.givenNames = doubleArrowSplit[1]
      ? doubleArrowSplit[1].split("<<")[0].split("<").join(",")
      : "";

    const secondRow = text.split("\n")[1];

    parts.passportNumber = secondRow.substring(0, 9).replace(/\</g, "");
    parts.checkDigits1 = secondRow[9];
    parts.nationality = secondRow.substring(10, 13).replace(/\</g, "");
    parts.dob = secondRow.substring(13, 19).replace(/\</g, "");
    parts.checkDigits2 = secondRow[19];
    parts.sex = secondRow[20];
    parts.expiryDateOfPassport = secondRow.substring(21, 27).replace(/\</g, "");
    parts.checkDigits3 = secondRow[27];
    parts.personalNumber = secondRow.substring(28, 42).replace(/\</g, "");
    parts.checkDigits4 = secondRow[42];
    parts.checkDigits5 = secondRow[43];

    success(parts);
  }
  //   validatePassportImage(data) {
  //     Tesseract.recognize(data.image, "eng", {
  //       logger: (m) => console.log(m),
  //     }).then(({ data: { text } }) => {});
  //   }
}

module.exports = PassportImageValidation;
