import {readdirSync, readFile, writeFile} from 'fs';

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

export function findSubFolders(folderPath: string): string[] {
  return readdirSync(folderPath, {withFileTypes: true})
    .filter(dir => dir.isDirectory())
    .map(dir => dir.name);
}
