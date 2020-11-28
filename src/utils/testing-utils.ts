import Crypto from 'crypto';
import {tmpdir} from 'os';
import Path from 'path';

function getRandomString() {
  return Crypto.randomBytes(6).readUIntLE(0, 6).toString(36);
}

export function tmpFile() {
  return Path.join(tmpdir(), `${getRandomString()}.tmp`);
}

export function tmpDir() {
  return Path.join(tmpdir(), getRandomString());
}
