export interface KeyProvider {
  getActiveKey(): Promise<{ kid: string; key: CryptoKey }>;
  getByKid(kid: string): Promise<CryptoKey | null>;
}

export interface Envelope {
  v: 1;
  alg: 'AES-GCM';
  kid: string;
  iv: string; // base64url
  tag?: string; // optional; if WebCrypto returns combined, omit
  aad: string; // base64url of `${ns}:${key}`
  ct: string; // base64url ciphertext (or combined)
  ts: string; // ISO timestamp of write
}
