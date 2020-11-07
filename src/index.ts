import {program} from 'commander';
import {readdirSync, readFile} from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import simpleGit, {SimpleGit, SimpleGitOptions} from 'simple-git';

require('dotenv').config();

interface DockerHubWebhookData {
  callbackUrl: string,
  repoUrl: string,
  imageName: string,
  tag: string,
  name: string,
  namespace: string,
  owner: string,
  workspacePath: string
}

interface Project {
  name: string,
  images: {
    [key: string]: { name: string, tag: string }
  }
}

function parseInput(): DockerHubWebhookData {
  program
    .storeOptionsAsProperties(false)
    .requiredOption('--callback-url <value>', 'callbackUrl')
    .requiredOption('--repo-url <value>', 'repoUrl')
    .requiredOption('--image-name <value>', 'imageName')
    .requiredOption('--tag <value>', 'tag')
    .requiredOption('--name <value>', 'name')
    .requiredOption('--namespace <value>', 'namespace')
    .requiredOption('--owner <value>', 'owner')
    .requiredOption('--workspace-path <value>', 'workspacePath');

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
    workspacePath: opts.workspacePath
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

async function readAllProjectConfigurations(): Promise<Project[]> {
  const workspaceLocation = `${dockerHubWebhookData.workspacePath}/apps`;
  const dirNames = readdirSync(workspaceLocation, {withFileTypes: true})
    .filter(dir => dir.isDirectory())
    .map(dir => dir.name);

  return await Promise.all(dirNames.map(dirName => {
    return loadProjectFromFile(path.join(workspaceLocation, dirName, 'bmw12-application.yaml'));
  }));
}

async function loadProjectFromFile(dirName: string): Promise<Project> {
  const data = await readUtf8File(dirName);
  return yaml.safeLoad(data) as Project;
}

function readUtf8File(file: string): Promise<string> {
  return new Promise((resolve, reject) => {
    readFile(file, {encoding: 'utf8'}, (err, data) => {
      if (err)
        reject(err);
      resolve(data);
    });
  });
}

function filterProjectsWithImage(projects: Project[], imageName: string) {
  return projects.filter(project => {
    return Object.values(project.images).find(image => image.name === imageName) !== undefined;
  });
}

function updateImageInProject(project: Project, imageName: string, imageTag: string): Project {
  for (let [key, image] of Object.entries(project.images)) {
    if (image.name !== imageName) {
      continue;
    }
    project.images[key].tag = imageTag;
  }
  return project;
}

(async () => {
  try {
    const projects = await readAllProjectConfigurations();
    const projectsWithChangedImage = filterProjectsWithImage(projects, dockerHubWebhookData.imageName);

    for (const project of projectsWithChangedImage) {
      console.log(`Updating image in Project: ${project.name}`);
      const updateProject = updateImageInProject(project, dockerHubWebhookData.imageName, dockerHubWebhookData.tag);


      console.log(updateProject);
    }
  } catch (e) {
    console.log(e);
  }
})();
