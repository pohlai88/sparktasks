/**
 * Sparkpack manifest with Ed25519 signing
 */

import {
  exportPublicKeyB64u,
  sign,
  verify,
  importPublicKeyB64u,
} from '../../crypto/ed25519';

import { type SparkpackMeta, type Sparkpack } from './types';

export interface Manifest {
  v: 1;
  createdAt: string;
  author: {
    pubkey: string; // base64url SPKI
  };
  content: {
    meta: SparkpackMeta;
    eventsHash: string; // SHA-256 of JSONL bytes
    bytes: number;
  };
  sig: string; // Ed25519 signature over canonical JSON
}

/**
 * Canonicalize object for signing (stable key order)
 */
function canonicalize(obj: any): string {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }

  if (Array.isArray(obj)) {
    return '[' + obj.map(canonicalize).join(',') + ']';
  }

  const keys = Object.keys(obj).sort();
  const pairs = keys.map(key => `"${key}":${canonicalize(obj[key])}`);
  return '{' + pairs.join(',') + '}';
}

/**
 * Create signed manifest for sparkpack
 */
export async function createManifest(
  pack: Sparkpack,
  privateKey: CryptoKey,
  publicKey?: CryptoKey
): Promise<Manifest> {
  // Use provided public key or generate a new pair for testing
  let pubKey: CryptoKey;
  if (publicKey) {
    pubKey = publicKey;
  } else {
    // For testing - generate a new key pair
    const keyPair = await crypto.subtle.generateKey(
      { name: 'Ed25519', namedCurve: 'Ed25519' },
      true,
      ['sign', 'verify']
    );
    pubKey = keyPair.publicKey;
  }

  const pubkeyB64u = await exportPublicKeyB64u(pubKey);

  // Hash events JSONL
  const eventsJsonl = pack.events.map(e => JSON.stringify(e)).join('\n');
  const eventsBytes = new TextEncoder().encode(eventsJsonl);
  const hashBuffer = await crypto.subtle.digest('SHA-256', eventsBytes);
  const eventsHash = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');

  // Build unsigned manifest
  const unsigned = {
    v: 1 as const,
    createdAt: new Date().toISOString(),
    author: { pubkey: pubkeyB64u },
    content: {
      meta: pack.meta,
      eventsHash,
      bytes: eventsBytes.length,
    },
  };

  // Sign canonical JSON
  const canonical = canonicalize(unsigned);
  const canonicalBytes = new TextEncoder().encode(canonical);
  const signature = await sign(privateKey, canonicalBytes.buffer);

  return { ...unsigned, sig: signature };
}

/**
 * Verify manifest signature and content hash
 */
export async function verifyManifest(
  manifest: Manifest,
  pack: Sparkpack
): Promise<boolean> {
  try {
    // Import public key
    const publicKey = await importPublicKeyB64u(manifest.author.pubkey);

    // Verify content hash
    const eventsJsonl = pack.events.map(e => JSON.stringify(e)).join('\n');
    const eventsBytes = new TextEncoder().encode(eventsJsonl);
    const hashBuffer = await crypto.subtle.digest('SHA-256', eventsBytes);
    const expectedHash = btoa(
      String.fromCharCode(...new Uint8Array(hashBuffer))
    )
      .replaceAll('+', '-')
      .replaceAll('/', '_')
      .replaceAll('=', '');

    if (manifest.content.eventsHash !== expectedHash) {
      return false;
    }

    if (manifest.content.bytes !== eventsBytes.length) {
      return false;
    }

    // Verify signature
    const unsigned = {
      v: manifest.v,
      createdAt: manifest.createdAt,
      author: manifest.author,
      content: manifest.content,
    };

    const canonical = canonicalize(unsigned);
    const canonicalBytes = new TextEncoder().encode(canonical);

    return await verify(publicKey, canonicalBytes.buffer, manifest.sig);
  } catch {
    return false;
  }
}
