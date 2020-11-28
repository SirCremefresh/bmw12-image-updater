import test from 'ava';
import {readUtf8File, writeUtf8File} from './file-utils';
import {tmpFile} from './testing-utils';

test('Test read and write file', async t => {
  const filePath = tmpFile();
  const data = 'data_in_file';

  await writeUtf8File(filePath, data);
  const dataFromFile = await readUtf8File(filePath);
  t.is(dataFromFile, data);
});
