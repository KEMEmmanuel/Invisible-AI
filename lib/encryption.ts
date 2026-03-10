/**
 * AES-GCM Encryption utilities for API keys
 * Built for security-first AI desktop assistant
 */

const ENCRYPTION_KEY_NAME = 'nova-ai-master-key';

async function getMasterKey(): Promise<CryptoKey> {
  const storedKey = localStorage.getItem(ENCRYPTION_KEY_NAME);
  if (storedKey) {
    const rawKey = Uint8Array.from(atob(storedKey), (c) => c.charCodeAt(0));
    return await crypto.subtle.importKey(
      'raw',
      rawKey,
      'AES-GCM',
      true,
      ['encrypt', 'decrypt']
    );
  }

  // Generate new master key if it doesn't exist
  const newKey = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  const exported = await crypto.subtle.exportKey('raw', newKey);
  const base64 = btoa(String.fromCharCode(...new Uint8Array(exported)));
  localStorage.setItem(ENCRYPTION_KEY_NAME, base64);

  return newKey;
}

export async function encryptApiKey(apiKey: string): Promise<string> {
  const masterKey = await getMasterKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(apiKey);

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    masterKey,
    encoded
  );

  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);

  return btoa(String.fromCharCode(...combined));
}

export async function decryptApiKey(encrypted: string): Promise<string> {
  try {
    const masterKey = await getMasterKey();
    const combined = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0));

    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      masterKey,
      data
    );

    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error('Decryption failed:', error);
    return '';
  }
}
