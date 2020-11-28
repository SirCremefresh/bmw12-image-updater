import Crypto from 'crypto';
import {tmpdir} from 'os';
import Path from 'path';

export function tmpFile() {
  return Path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.tmp`);
}
