const path = require("path");
const fs = require("fs");
const chalk = require("chalk");

// find all arguments, leaving the first two, node and yarn
const args = process.argv.slice(2);

// set the folders where the translation files exist
const folderToScan = path.join(__dirname, "../shared/i18n/lang");

const files = fs.readdirSync(folderToScan);

// allowed operations
const availableOperations = [
  "--add",
  "--del",
  "--set",
  "-a",
  "-d",
  "-s",
  "--sync",
];

const reservedActions = ["-f", "-en", "-fr", "-pl"];

// operation to be performed. check if it exists
const [operation] = availableOperations.filter(key => args.indexOf(key) >= 0);

if (!operation) {
  console.log("=> Error: Operation not found. Use --add, --del or --set");
  return;
}

if (operation == "--sync") {
  const store = {};
  // get contents of all files and store them. This data will be used in syncing
  files.forEach(file => {
    if (path.extname(file) !== ".json") return;
    const filePath = folderToScan + "/" + file;
    const contents = getContentsOfFile(filePath);
    store[file] = contents.translations;
  });

  // Reference language file contents
  const reference = store["en.json"];

  // loop through each language file
  files.forEach(file => {
    if (path.extname(file) !== ".json") return;
    if (file === "en.json") return;
    const filePath = folderToScan + "/" + file;
    const oldContents = store[file];
    const newContents = { translations: {} };
    // loop through the reference file and get keys
    Object.keys(reference).map(key => {
      newContents.translations[key] = oldContents.hasOwnProperty(key)
        ? oldContents[key]
        : "";
    });
    newContents.translations = ksortObject(newContents.translations);
    fs.writeFileSync(filePath, JSON.stringify(newContents, null, 4));
    console.log(chalk.green(`✓ File ${file} was synced successfully`));
  });

  return;
}

// check if any actions are required
let currentAction = null;
if (reservedActions.indexOf(args[1]) >= 0) {
  currentAction = args[1];
}

// expect key/value pair
let index = reservedActions.indexOf(args[1]) >= 0 ? 2 : 1;

const [key, value] = args[index].split("=");

const incorrectParamsAlert = (value, msg) => {
  if (typeof value === "undefined") {
    console.log(
      `
usage: yarn [operation] [options] [key=value || key]
    operation (Required):
        -a, --add     Add key value pair to all files
        -s, --set     Set value of an existing key in all files
        -d, --del     Delete key from all files
            --sync    Sync all files with en.json
    options (Optional)
        -en     Operation only on this file
        -fr     Operation only on this file
        -pl     Operation only on this file
`,
    );
    console.log(chalk.yellow(msg));
    return true;
  }
  return false;
};
switch (operation) {
  case "-a":
  case "--add":
    if (
      incorrectParamsAlert(value, "Error: Provide a key value pair, key=value")
    ) {
      return;
    }
    files.forEach(file => {
      const name = file.split(".")[0];

      if (path.extname(file) !== ".json") return;

      const filePath = folderToScan + "/" + file;
      const contents = getContentsOfFile(filePath);

      if (key in contents.translations) {
        console.log(chalk.yellow(`Key ${key} found in ${file}. File ignored.`));
        return;
      }
      let changed = false;
      if (currentAction && reservedActions.indexOf(`-${name}`) >= 0) {
        if (`-${name}` === currentAction) {
          contents.translations[key] = value;
          changed = true;
        }
      } else {
        if (file === "en.json") {
          contents.translations[key] = value;
        } else {
          contents.translations[key] = "";
        }
        changed = true;
      }
      if (changed) {
        contents.translations = ksortObject(contents.translations);
        fs.writeFileSync(filePath, JSON.stringify(contents, null, 4));
        console.log(chalk.green(`✓ File ${file} was written successfully`));
      } else {
        console.log(chalk.white(`Nothing changed in: ${file}`));
      }
    });
    break;
  case "-d":
  case "--del":
    files.forEach(file => {
      const name = file.split(".")[0];
      reservedActions.push("-" + name);

      if (path.extname(file) !== ".json") return;
      const filePath = folderToScan + "/" + file;
      const contents = getContentsOfFile(filePath);
      let changed = false;
      let keyExist = key in contents.translations;

      if (
        currentAction &&
        reservedActions.indexOf(`-${name}`) >= 0 &&
        keyExist
      ) {
        if (`-${name}` === currentAction) {
          console.log(chalk.red(`Deleting ${key} from ${file}`));
          delete contents.translations[key];
          changed = true;
        }
      } else if (keyExist) {
        delete contents.translations[key];
        console.log(chalk.red(`Deleting ${key} from ${file}`));
        changed = true;
      }
      if (changed) {
        contents.translations = ksortObject(contents.translations);
        fs.writeFileSync(filePath, JSON.stringify(contents, null, 4));
        console.log(chalk.green(`=> ✓ File written successfully: ${file}`));
      } else {
        console.log(chalk.white(`Nothing changed in: ${file}`));
      }
    });
    break;
  case "-s":
  case "--set":
    if (
      incorrectParamsAlert(value, "Error: Provide a key value pair, key=value")
    ) {
      return;
    }
    files.forEach(file => {
      const name = file.split(".")[0];
      reservedActions.push("-" + name);

      if (path.extname(file) !== ".json") return;
      const filePath = folderToScan + "/" + file;
      const contents = getContentsOfFile(filePath);

      let change = false;

      if (currentAction && reservedActions.indexOf(`-${name}`) >= 0) {
        if (`-${name}` === currentAction) {
          console.log(chalk.white(`Setting ${key} to ${value} in ${file}`));
          contents.translations[key] = value;
          change = true;
        }
      } else {
        if (file === "en.json") {
          contents.translations[key] = value;
          console.log(chalk.white(`Setting ${key} to ${value} in ${file}`));
        } else {
          contents.translations[key] = "";
          console.log(chalk.white(`Setting ${key} to ${value} in ${file}`));
        }
        change = true;
      }
      if (change) {
        contents.translations = ksortObject(contents.translations);
        fs.writeFileSync(filePath, JSON.stringify(contents, null, 4));
        console.log(chalk.green(`=> ✓ File written successfully: ${file}`));
      } else {
        console.log(chalk.white(`Nothing changed in: ${file}`));
      }
    });
    break;
}

function getContentsOfFile(path) {
  return require(path);
}

function ksortObject(obj) {
  const keys = Object.keys(obj);
  keys.sort();
  return keys.reduce((target, key) => {
    target[key] = obj[key];
    return target;
  }, {});
}
