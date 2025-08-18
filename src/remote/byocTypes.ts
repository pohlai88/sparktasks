/**
 * BYOC (Bring Your Own Cloud) types for remote transport
 */

export interface BlobRef {
  url: string;
}

export interface PutResult {
  ref: BlobRef;
  etag?: string;
}

export interface HeadResult {
  etag?: string;
  size?: number;
}

/**
 * BYOC interface for uploading/downloading blobs and JSON
 */
export interface BYOC {
  putJson(path: string, obj: unknown): Promise<PutResult>;
  getJson<T>(path: string): Promise<T | null>;
  putBlob(path: string, data: ArrayBuffer): Promise<PutResult>;
  getBlob(path: string): Promise<ArrayBuffer | null>;
  head(path: string): Promise<HeadResult | null>;
}
