import test from 'ava';
import Crypto from 'crypto';
import {tmpdir} from 'os';
import Path from 'path';
import {readUtf8File, writeUtf8File} from './file-utils';

function tmpFile() {
  return Path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.tmp`);
}

test('Test read and write file', async t => {
  const filePath = tmpFile();
  const data = 'data_in_file';

  await writeUtf8File(filePath, data);
  const dataFromFile = await readUtf8File(filePath);
  t.is(dataFromFile, data);
});
