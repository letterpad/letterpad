import { exec } from "child_process";

// change this to use spawn.

export const execShellCommand = (command: string): Promise<string> => {
  let timeout: NodeJS.Timeout;

  return new Promise((resolve, reject) => {
    exec(`${command}`, (err, stdout) => {
      clearTimeout(timeout);
      if (err) {
        reject(err);
      } else {
        resolve(stdout);
      }
    });
  });
};
