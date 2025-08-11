use aes_gcm::{
    aead::{Aead,AeadCore, KeyInit, OsRng},
    Aes256Gcm, Nonce, Key
};
use base64::{Engine as _, engine::general_purpose};

#[derive(Clone)]
pub struct CryptoService{
    cipher: Aes256Gcm,
}

impl CryptoService {
    pub fn new() -> Self {
        let key = Aes256Gcm::generate_key(OsRng);
        Self {
            cipher: Aes256Gcm::new(&key),
        }
    }

    pub fn encrypt(&self, plaintext: &str) -> Result<(String, String), String> {
        let nonce = Aes256Gcm::generate_nonce(&mut OsRng);
        let ciphertext = self.cipher
            .encrypt(&nonce, plaintext.as_bytes())
            .map_err(|e| format!("Encryption failed: {}", e))?;

        Ok((general_purpose::STANDARD.encode(ciphertext),
            general_purpose::STANDARD.encode(nonce)))
    }

    pub fn decrypt(&self, ciphertext: &str, nonce: &str) -> Result<String, String> {
        let ct_bytes = general_purpose::STANDARD.decode(ciphertext)
            .map_err(|_| "Invalid ciphertext encoding")?;

        let nonce_bytes = general_purpose::STANDARD.decode(nonce)
            .map_err(|_| "Invalid nonce encoding")?;

        let nonce = Nonce::from_slice(&nonce_bytes);

        let plaintext = self.cipher
            .decrypt(nonce, ct_bytes.as_ref())
            .map_err(|e| format!("Decryption failed: {}", e))?;

        String::from_utf8(plaintext).map_err(|e| format!("UTF-8 conversion failed: {}", e))
    }
}