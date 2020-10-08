// import {Octokit} from '@octokit/rest';
import {program} from 'commander';
// import {OctokitResponse, ReposGetResponseData} from '@octokit/types';

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

// type ListUserReposResponse = Endpoints['GET /repos/:owner/:repo']['response'];
//
// const DEBUG = process.env.DEBUG === 'true';
// if (DEBUG) {
// 	console.debug('Debug logging is enabled');
// }
//
// const GITHUB_AUTH_TOKEN = process.env.GITHUB_AUTH_TOKEN;
// if (GITHUB_AUTH_TOKEN === undefined) {
// 	console.error('The environment variable: "GITHUB_AUTH_TOKEN" is not set. Killing Application ');
// 	process.exit(1);
// } else {
// 	console.info('Github Auth Token successfully loaded from environment variable. variable: "GITHUB_AUTH_TOKEN"');
// }
//
// // const octokit = new Octokit({
// // 	auth: GITHUB_AUTH_TOKEN
// // });
// //
//
//
// (async () => {
//
// 	console.log(process.env.DATA);
//
//
// 	function getDataFromArguments(): any {
// 		for (const argument of process.argv) {
// 			return argument;
// 		}
// 	}
//
// 	// const {
// 	// 	data
// 	// } = await octokit.repos.get({
// 	// 	owner: 'SirCremefresh',
// 	// 	repo: 'bmw12-cluster',
// 	// }) as OctokitResponse<ReposGetResponseData>;
// 	// console.log(data);
// })();
