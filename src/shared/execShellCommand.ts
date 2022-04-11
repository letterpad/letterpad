const { exec } = require("child_process");

// change this to use spawn.

export const execShellCommand = (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(command, (err: string, stdout: string, _stderr: string) => {
      if (err) {
        reject(err);
      } else {
        resolve(stdout);
      }
    });
  });
};
