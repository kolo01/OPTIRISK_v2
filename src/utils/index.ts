import CryptoJS from "crypto-js";

const SECRET_KEY = "ma-cle-secrete-123"; // ⚠️ jamais en clair en prod

export function encryptEmail(email: string) {
  return CryptoJS.AES.encrypt(email, SECRET_KEY).toString();
}

export function decryptEmail(cipherText: string) {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}
