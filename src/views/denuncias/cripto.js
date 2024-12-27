import CryptoJS from 'crypto-js';

// Chave secreta (deve ser mantida segura e não exposta no frontend)
const secretKey = 'your_32_character_secret_key_123456';

// Função para criptografar um ID e codificar em Base64 URL-safe
export const encryptID = (id) => {
  // Converte o ID para uma string e criptografa
  const idString = `${id}`
  const encrypted = CryptoJS.AES.encrypt(idString, secretKey).toString();
  
  // Codifica a string criptografada para Base64 URL-safe
  return encrypted.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Função para decodificar de Base64 URL-safe e descriptografar o ID
export const decryptID = (encryptedID) => {
  try {
    // Decodifica a string Base64 URL-safe
    const base64 = encryptedID.replace(/-/g, '+').replace(/_/g, '/');
    const bytes = CryptoJS.AES.decrypt(base64, secretKey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return parseInt(originalText, 10);
  } catch (error) {
    console.error('Erro ao descriptografar o ID:', error);
    return null;
  }
}