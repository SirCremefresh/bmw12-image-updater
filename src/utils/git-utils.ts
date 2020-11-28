import simpleGit, {SimpleGit, SimpleGitOptions} from 'simple-git';
import {executeCommand} from './execute-utils';


export async function initialiseGit({workspacePath, email, name}: { workspacePath: string, email: string, name: string }): Promise<SimpleGit> {
  const options: SimpleGitOptions = {
    baseDir: workspacePath,
    binary: 'git',
    maxConcurrentProcesses: 6,
  };
  const git: SimpleGit = simpleGit(options);

  await executeCommand(`git config --global user.email "${email}"`);
  await executeCommand(`git config --global user.name "${name}"`);
  await git.checkoutLocalBranch('master');
  return git;
}
