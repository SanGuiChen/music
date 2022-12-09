// import { Base64 } from 'js-base64'
import { createHash } from 'crypto';

// Base64
// export function decodeBase64(value: string): string {
//   return value ? Base64.decode(value) : value
// }

// md5
export function decodeMD5(value: string): string {
  return createHash('md5').update(value).digest('hex');
}

export function compareMD5(plain: string, encrypted: string): boolean {
  return decodeMD5(plain) === encrypted;
}
