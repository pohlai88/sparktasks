/**
 * BYOC implementation with high-level helpers
 */

import { BYOC, BlobRef, PutResult } from './byocTypes';
import {
  Manifest,
  createManifest,
  verifyManifest,
} from '../domain/pack/manifest';
import { Sparkpack } from '../domain/pack/types';

/**
 * Simple in-memory BYOC for testing
 */
export class MemoryBYOC implements BYOC {
  private storage = new Map<string, ArrayBuffer>();
  private etags = new Map<string, string>();

  async putJson(path: string, obj: unknown): Promise<PutResult> {
    const json = JSON.stringify(obj);
    const data = new TextEncoder().encode(json);
    return this.putBlob(path, data.buffer);
  }

  async getJson<T>(path: string): Promise<T | null> {
    const data = await this.getBlob(path);
    if (!data) return null;
    const json = new TextDecoder().decode(data);
    return JSON.parse(json) as T;
  }

  async putBlob(path: string, data: ArrayBuffer): Promise<PutResult> {
    this.storage.set(path, data.slice()); // copy
    const etag = Date.now().toString(36) + Math.random().toString(36);
    this.etags.set(path, etag);
    return {
      ref: { url: `memory://${path}` },
      etag,
    };
  }

  async getBlob(path: string): Promise<ArrayBuffer | null> {
    const data = this.storage.get(path);
    return data ? data.slice() : null; // copy
  }

  async head(path: string): Promise<{ etag?: string; size?: number } | null> {
    const data = this.storage.get(path);
    if (!data) return null;
    const etag = this.etags.get(path);
    return {
      ...(etag && { etag }),
      size: data.byteLength,
    };
  }
}

/**
 * Upload sparkpack with manifest
 */
export async function uploadPack(
  byoc: BYOC,
  pack: Sparkpack,
  privateKey: CryptoKey,
  publicKey?: CryptoKey
): Promise<{ manifest: Manifest; eventsRef: BlobRef }> {
  // Convert events to JSONL for hashing
  const eventsJsonl = pack.events.map(e => JSON.stringify(e)).join('\n');
  const eventsData = new TextEncoder().encode(eventsJsonl);

  // Compute hash for consistent ID
  const hashBuffer = await crypto.subtle.digest('SHA-256', eventsData);
  const computedHash = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  // Upload events with computed hash as ID
  const eventsResult = await byoc.putBlob(
    `packs/${computedHash}/events.jsonl`,
    eventsData.buffer
  );

  // Create and upload manifest
  const manifest = await createManifest(pack, privateKey, publicKey);
  await byoc.putJson(`packs/${computedHash}/manifest.json`, manifest);

  return {
    manifest,
    eventsRef: eventsResult.ref,
  };
}

/**
 * Download and verify sparkpack
 */
export async function downloadPack(
  byoc: BYOC,
  manifestPath: string
): Promise<Sparkpack | null> {
  try {
    // Download manifest
    const manifest = await byoc.getJson<Manifest>(manifestPath);
    if (!manifest) return null;

    // Download events using manifest hash as ID
    const packHash = manifest.content.eventsHash;
    const eventsData = await byoc.getBlob(`packs/${packHash}/events.jsonl`);
    if (!eventsData) return null;

    // Parse JSONL to events array
    const eventsJsonl = new TextDecoder().decode(eventsData);
    const events = eventsJsonl
      .split('\n')
      .filter(line => line.trim())
      .map(line => JSON.parse(line));
    const pack = { meta: manifest.content.meta, events };

    // Verify signature and hash
    const isValid = await verifyManifest(manifest, pack);
    if (!isValid) return null;

    return pack;
  } catch {
    return null;
  }
}
