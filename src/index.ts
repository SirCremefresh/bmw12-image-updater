import {program} from 'commander';
import {readdirSync} from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import simpleGit, {SimpleGit, SimpleGitOptions} from 'simple-git';
import {Project, ProjectData} from './project.type';
import {UpdateImageOptions} from './update-image-options.type';
import {executeCommand} from './utils/execute-utils';
import {readUtf8File, writeUtf8File} from './utils/file-utils';

require('dotenv').config();

function parseInput(): UpdateImageOptions {
  program
    .storeOptionsAsProperties(false)
    .requiredOption('--callback-url <value>', 'callbackUrl')
    .requiredOption('--repo-url <value>', 'repoUrl')
    .requiredOption('--image-name <value>', 'imageName')
    .requiredOption('--tag <value>', 'tag')
    .requiredOption('--name <value>', 'name')
    .requiredOption('--namespace <value>', 'namespace')
    .requiredOption('--owner <value>', 'owner')
    .requiredOption('--workspace-path <value>', 'workspacePath')
    .requiredOption('--git-email <value>', 'gitEmail')
    .requiredOption('--git-name <value>', 'gitName');

  program.parse(process.argv);
  const opts = program.opts();
  return {
    callbackUrl: opts.callbackUrl,
    repoUrl: opts.repoUrl,
    imageName: opts.imageName,
    tag: opts.tag,
    name: opts.name,
    namespace: opts.namespace,
    owner: opts.owner,
    workspacePath: opts.workspacePath,
    gitEmail: opts.gitEmail,
    gitName: opts.gitName
  };
}

const dockerHubWebhookData = parseInput();

const DEBUG = process.env.DEBUG === 'true';
if (DEBUG) {
  console.debug('Debug logging is enabled');
}

console.log(`Starting with options: ${JSON.stringify(dockerHubWebhookData)}`);

const options: SimpleGitOptions = {
  baseDir: dockerHubWebhookData.workspacePath,
  binary: 'git',
  maxConcurrentProcesses: 6,
};

const git: SimpleGit = simpleGit(options);
const CONFIG_FILE_NAME = 'bmw12-application.yaml';


async function readAllProjectConfigurations(): Promise<Project[]> {
  const workspaceLocation = `${dockerHubWebhookData.workspacePath}/apps`;
  const dirNames = readdirSync(workspaceLocation, {withFileTypes: true})
    .filter(dir => dir.isDirectory())
    .map(dir => dir.name);

  return await Promise.all(dirNames.map(dirName => {
    return loadProjectFromFile(path.join(workspaceLocation, dirName, CONFIG_FILE_NAME), dirName);
  }));
}

async function loadProjectFromFile(fileName: string, dirName: string): Promise<Project> {
  const data = await readUtf8File(fileName);
  return {fileName, dirName, projectData: yaml.safeLoad(data) as ProjectData};
}

async function writeProjectToFile(project: Project): Promise<void> {
  await writeUtf8File(project.fileName, yaml.safeDump(project.projectData));
}

function filterProjectsWithImage(projects: Project[], imageName: string) {
  return projects.filter(project => {
    return Object.values(project.projectData.images).find(image => image.name === imageName) !== undefined;
  });
}

function updateImageInProject(project: Project, imageName: string, imageTag: string): Project {
  for (let [key, image] of Object.entries(project.projectData.images)) {
    if (image.name !== imageName) {
      continue;
    }
    project.projectData.images[key].tag = imageTag;
  }
  return project;
}

(async () => {
  try {
    const projects = await readAllProjectConfigurations();
    const projectsWithChangedImage = filterProjectsWithImage(projects, dockerHubWebhookData.imageName);

    await executeCommand(`git config --global user.email "${dockerHubWebhookData.gitEmail}"`);
    await executeCommand(`git config --global user.name "${dockerHubWebhookData.gitName}"`);
    await git.checkoutLocalBranch('master');

    for (const project of projectsWithChangedImage) {
      console.log(`Updating image in Project: ${project.projectData.name}`);
      const updateProject = updateImageInProject(project, dockerHubWebhookData.imageName, dockerHubWebhookData.tag);

      await writeProjectToFile(updateProject);

      await git.add(path.join('apps', project.dirName, CONFIG_FILE_NAME));
      await git.commit(`Updating project: ${project.projectData.name}, imageTag: ${dockerHubWebhookData.tag}, imageName: ${dockerHubWebhookData.imageName}`);
      await git.push('origin', 'master');
    }
  } catch (e) {
    console.log(e);
  }
})();
