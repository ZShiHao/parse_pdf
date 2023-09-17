import { PDFDocument } from "pdf-lib";

function getLanguage(pdf: PDFDocument) {
  const reg = /^[\u4E00-\u9FA5]+$/;
  const title = pdf.getTitle();
  if (!title) {
    return "";
  } else if (reg.test(title)) {
    return "中文";
  } else {
    return "English";
  }
}

function standardizeFileName(_old: string) {
  let title = _old.substring(0, _old.lastIndexOf("."));
  let _new = title
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replaceAll("PDFDrive", " ")
    .replaceAll(/ +/g, " ")
    .trim()+'.pdf';
  return _new
}

function standardizeTitle(_old: string) {
  let _new = _old
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replaceAll("PDFDrive", " ")
    .replaceAll(".com", " ")
    .replaceAll(/ +/g, " ")
    .trim();
  return _new
}

export { getLanguage, standardizeFileName,standardizeTitle };
