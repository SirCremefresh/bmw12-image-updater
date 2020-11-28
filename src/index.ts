import path from 'path';
import {getInputOptions} from './input';
import {
  filterProjectsWithImage,
  readAllProjectConfigurations,
  updateImageInProject,
  writeProjectToFile
} from './project';
import {initialiseGit} from './utils/git-utils';

require('dotenv').config();

const CONFIG_FILE_NAME = 'bmw12-application.yaml';
const DEBUG = process.env.DEBUG === 'true';
if (DEBUG) {
  console.debug('Debug logging is enabled');
}

const updateImageOptions = getInputOptions();
console.log(`Starting with options: ${JSON.stringify(updateImageOptions)}`);

(async () => {
  const projects = await readAllProjectConfigurations(updateImageOptions.workspacePath, CONFIG_FILE_NAME);
  const projectsWithChangedImage = filterProjectsWithImage(projects, updateImageOptions.imageName);

  if (projectsWithChangedImage.length === 0) {
    console.log(`No project found with image. imageName: ${updateImageOptions.imageName}`);
    process.exit(0);
  }
  console.log(`Found ${projectsWithChangedImage.length} project using the image. imageName: ${updateImageOptions.imageName}, projects: "${projectsWithChangedImage.map(value => value.projectData.name).join(', ')}"`);

  const git = await initialiseGit({
    workspacePath: updateImageOptions.workspacePath,
    name: updateImageOptions.gitName,
    email: updateImageOptions.gitEmail
  });

  for (const project of projectsWithChangedImage) {
    try {
      console.log(`Updating image in Project: ${project.projectData.name}`);
      const updateProject = updateImageInProject(project, updateImageOptions.imageName, updateImageOptions.tag);
      await writeProjectToFile(updateProject);

      await git.add(path.join('apps', project.projectData.name, CONFIG_FILE_NAME));
      await git.commit(`Updating project: ${project.projectData.name}, imageTag: ${updateImageOptions.tag}, imageName: ${updateImageOptions.imageName}`);
    } catch (e) {
      console.error(`Could not update project: ${JSON.stringify(project)}`);
      console.log('error: ', e);
      process.exit(1);
    }
  }

  try {
    await git.push('origin', 'master');
  } catch (e) {
    console.error('Could not push changes to origin');
    console.log('error: ', e);
    process.exit(1);
  }
})();
