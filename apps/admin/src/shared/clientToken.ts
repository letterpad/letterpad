// import uuidV4 from "uuid/dist/v4";
import Hashids from "hashids";
const hashids = new Hashids();

const SECRET_KEY = process.env.SECRET_KEY || "";

export function encryptEmail(text: string) {
  const hash = hashids.encodeHex(stringToHex(text + SECRET_KEY));
  return hash;
}

export function decryptEmail(hash: string) {
  const email = hexToString(hashids.decodeHex(hash)).replace(SECRET_KEY, "");
  return email;
}

function hexToString(hex: string) {
  let str = "";
  for (let i = 0; i < hex.length; i += 2) {
    const charCode = parseInt(hex.substr(i, 2), 16);
    str += String.fromCharCode(charCode);
  }
  return str;
}

function stringToHex(str: string) {
  let hex = "";
  for (let i = 0; i < str.length; i++) {
    hex += str.charCodeAt(i).toString(16).padStart(2, "0");
  }
  return hex;
}
