import { exec } from "child_process";

// change this to use spawn.

export const execShellCommand = (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(`${command}`, (err, stdout) => {
      if (err) {
        reject(err);
      } else {
        resolve(stdout);
      }
    });
  });
};
