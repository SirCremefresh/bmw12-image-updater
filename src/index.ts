import {Octokit} from '@octokit/rest';
import {OctokitResponse, PullsListResponseData, ReposGetResponseData} from '@octokit/types';
import {program} from 'commander';
import {readdirSync, readFile} from 'fs';
import yaml from 'js-yaml';
import path from 'path';

require('dotenv').config();

interface DockerHubWebhookData {
	callbackUrl: string,
	repoUrl: string,
	imageName: string,
	tag: string,
	name: string,
	namespace: string,
	owner: string,
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
		.requiredOption('--owner <value>', 'owner');

	program.parse(process.argv);
	const opts = program.opts();
	return {
		callbackUrl: opts.callbackUrl,
		repoUrl: opts.repoUrl,
		imageName: opts.imageName,
		tag: opts.tag,
		name: opts.name,
		namespace: opts.namespace,
		owner: opts.owner
	};
}

const dockerHubWebhookData = parseInput();

console.log(dockerHubWebhookData);


const DEBUG = process.env.DEBUG === 'true';
if (DEBUG) {
	console.debug('Debug logging is enabled');
}

const GITHUB_AUTH_TOKEN = process.env.GITHUB_AUTH_TOKEN;
if (GITHUB_AUTH_TOKEN === undefined) {
	console.error('The environment variable: "GITHUB_AUTH_TOKEN" is not set. Killing Application ');
	process.exit(1);
} else {
	console.info('Github Auth Token successfully loaded from environment variable. variable: "GITHUB_AUTH_TOKEN"');
}

const octokit = new Octokit({
	auth: GITHUB_AUTH_TOKEN
});


// octokit.pulls.list({
// 	owner,
// 	repo,
// });

async function getOpenPullRequests() {
	const {data} = await octokit.pulls.list({
		owner: 'SirCremefresh',
		repo: 'bmw12-cluster',
	}) as OctokitResponse<PullsListResponseData>;
	return data;
}

async function readAllProjectConfigurations(): Promise<Project[]> {
	const workspaceLocation = './workspace/bmw12-cluster/apps';
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

(async () => {
	try {
		const projects = await readAllProjectConfigurations();
		// console.log(JSON.stringify(projects));
		const projectsWithChangedImage = filterProjectsWithImage(projects, dockerHubWebhookData.imageName);
		console.log(projectsWithChangedImage)
		// const pullRequests = await getOpenPullRequests();
		// // const pullRequest = pullRequests.find(pullRequest => pullRequest.head.ref === dockerHubWebhookData)
		//
		//
		// console.log(dockerHubWebhookData);
		// console.log(pullRequests[0].head.ref);
		// console.log(pullRequests);

		// await octokit.pulls.create({
		// 	owner: 'SirCremefresh',
		// 	repo: 'bmw12-cluster',
		// 	title: 'Update sample-application',
		// 	head: 'update/sample-application',
		// 	base: 'master',
		// });
	} catch (e) {
		console.log(e);
	}


})();

async function test1() {
	const {
		data
	} = await octokit.repos.get({
		owner: 'SirCremefresh',
		repo: 'bmw12-cluster',
	}) as OctokitResponse<ReposGetResponseData>;
	console.log(data);
}
