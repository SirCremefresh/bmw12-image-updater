import test from 'ava';
import {existsSync} from 'fs';
import {executeCommand} from './execute-utils';
import {tmpFile} from './testing-utils';

test('test command executed', async t => {
  const filePath = tmpFile();

  await executeCommand(`touch ${filePath}`);
  t.true(existsSync(filePath));
});

test('test out is returned', async t => {
  const data = 'sample data';
  t.is(await executeCommand(`echo ${data}`), `${data}\n`);
});


test('test error is returned', async t => {
  const exception = await t.throwsAsync(async () => {
    await executeCommand(`exit 1`);
  });
  t.is(exception.message, 'Command failed: exit 1\n')
});
