import test from 'ava';
import {mkdirSync} from 'fs';
import path from 'path';
import {loadProjectFromFile, writeProjectToFile} from './project';
import {Project} from './project.type';
import {tmpDir} from './utils/testing-utils';

test('Test read and write project', async t => {
  const baseDirPath = tmpDir();
  mkdirSync(baseDirPath);
  const projectName = 'some-project';
  const projectPath = path.join(baseDirPath, projectName);
  mkdirSync(projectPath);
  const projectFilePath = path.join(projectPath, 'bmw12-project.yaml');


  const project: Project = {
    fileName: projectFilePath,
    projectData: {
      name: projectName,
      images: {
        backend: {
          name: 'donato/backend',
          tag: 'v0.0.1'
        }
      }
    }
  };

  await writeProjectToFile(project);
  const projectFromFile = await loadProjectFromFile(projectFilePath);
  t.deepEqual(projectFromFile, project);
});
