import yaml from 'js-yaml';
import path from 'path';
import {Project, ProjectData} from './project.type';
import {findSubFolders, getLastFolder, readUtf8File, writeUtf8File} from './utils/file-utils';

export async function readAllProjectConfigurations(workspacePath: string, configFileName: string): Promise<Project[]> {
  const workspaceLocation = `${workspacePath}/apps`;
  const dirNames = findSubFolders(workspaceLocation);

  return await Promise.all(dirNames.map(dirName => {
    return loadProjectFromFile(path.join(workspaceLocation, dirName, configFileName));
  }));
}

export async function loadProjectFromFile(fileName: string): Promise<Project> {
  const data = await readUtf8File(fileName);
  const dirName = getLastFolder(fileName);
  const projectData = yaml.safeLoad(data) as ProjectData;

  if (projectData.name !== dirName) {
    console.error('Project name and folder need to be the same.');
    console.log(`dirName: ${dirName}, fileName: ${fileName}, projectData: ${JSON.stringify(projectData)}`);
    process.exit(1);
  }

  return {fileName, projectData};
}

export async function writeProjectToFile(project: Project): Promise<void> {
  await writeUtf8File(project.fileName, yaml.safeDump(project.projectData));
}

export function filterProjectsWithImage(projects: Project[], imageName: string) {
  return projects.filter(project => {
    return Object.values(project.projectData.images).find(image => image.name === imageName) !== undefined;
  });
}

export function updateImageInProject(project: Project, imageName: string, imageTag: string): Project {
  for (let [key, image] of Object.entries(project.projectData.images)) {
    if (image.name !== imageName) {
      continue;
    }
    project.projectData.images[key].tag = imageTag;
  }
  return project;
}
