import {exec} from "child_process";

export function executeCommand(command: string) {
  return new Promise((res, rej) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        rej(new Error(error.message));
      } else if (stderr) {
        rej(new Error(stderr));
      } else {
        res(stdout);
      }
    });
  });
}
