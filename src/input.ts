import {program} from 'commander';
import {UpdateImageOptions} from './update-image-options.type';

export function getInputOptions(): UpdateImageOptions {
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
