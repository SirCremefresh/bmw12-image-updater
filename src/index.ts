import {Octokit} from '@octokit/rest';
import {OctokitResponse, ReposGetResponseData} from '@octokit/types';

require('dotenv').config();

// type ListUserReposResponse = Endpoints['GET /repos/:owner/:repo']['response'];

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

interface DockerHubWebhookData {
	callbackUrl: string,
	repoUrl: string,
	imageName: string,
	tag: string,
	name: string,
	namespace: string,
	owner: string,
}


(async () => {
	const {
		data
	} = await octokit.repos.get({
		owner: 'SirCremefresh',
		repo: 'bmw12-cluster',
	}) as OctokitResponse<ReposGetResponseData>;
	console.log(data);
})();
