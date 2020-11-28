import test from 'ava';
import {mkdirSync} from 'fs';
import path from 'path';
import {findSubFolders, getLastFolder, readUtf8File, writeUtf8File} from './file-utils';
import {tmpDir, tmpFile} from './testing-utils';

test('Test read and write file', async t => {
  const filePath = tmpFile();
  const data = 'data_in_file';

  await writeUtf8File(filePath, data);
  const dataFromFile = await readUtf8File(filePath);
  t.is(dataFromFile, data);
});

test.only('Test find subFolders', async t => {
  const dirPath = tmpDir();
  mkdirSync(dirPath);
  mkdirSync(path.join(dirPath, 'folder1'));
  mkdirSync(path.join(dirPath, 'folder2'));

  const subFolders = await findSubFolders(dirPath);
  t.deepEqual(subFolders, ['folder1', 'folder2']);
});

test.only('Test find subFolders empty', async t => {
  const dirPath = tmpDir();
  mkdirSync(dirPath);

  const subFolders = await findSubFolders(dirPath);
  t.deepEqual(subFolders, []);
});

test.only('Test find subFolders folder not exists', async t => {
  const dirPath = tmpDir();
  await t.throwsAsync(async () => await findSubFolders(dirPath));
});

test.only('Test get last folder name', t => {
  t.is(getLastFolder("/la/apps/some-project/project.yaml"), "some-project");
});
