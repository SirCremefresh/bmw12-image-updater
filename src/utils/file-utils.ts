import {readFile, writeFile} from 'fs';

export function readUtf8File(file: string): Promise<string> {
  return new Promise((resolve, reject) => {
    readFile(file, {encoding: 'utf8'}, (err, data) => {
      if (err)
        reject(err);
      resolve(data);
    });
  });
}

export function writeUtf8File(file: string, data: string): Promise<string> {
  return new Promise((resolve, reject) => {
    writeFile(file, data, {encoding: 'utf8'}, (err) => {
      if (err)
        reject(err);
      resolve();
    });
  });
}
