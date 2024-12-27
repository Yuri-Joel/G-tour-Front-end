import Cookies from "js-cookie"
import CryptoJS from 'crypto-js';
import { React_APP } from "./api/api.pnp";


const SECRET_KEY = React_APP;

export const SaveToken = (userlogin) => {

  const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(userlogin), SECRET_KEY).toString();
  
  Cookies.set('userlogin', encryptedData);

}

export const GetTokenCookie = (token) => {

  const encryptedData = Cookies.get('userlogin');
  if (!encryptedData) return null;


  const decryptedData = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY).toString(CryptoJS.enc.Utf8);
  const userlogin = JSON.parse(decryptedData);

  if (token == null) {
    return userlogin
  }
  else{
    return userlogin.token
  }
 
}

export const RemoveTokenCookie = () => {

  Cookies.remove("userlogin")
}
