/**
 * This script is for internal `react-boilerplate`'s usage.
 * It will run all generators in order to be able to lint them and detect
 * critical errors. Every generated component's name starts with 'RbGenerated'
 * and any modified file is backed up by a file with the same name but with the
 * 'rbgen' extension so it can be easily excluded from the test coverage reports.
 */

const chalk = require('chalk');
const fs = require('fs');
const nodePlop = require('node-plop');
const path = require('path');
const rimraf = require('rimraf');
const shell = require('shelljs');

const addCheckmark = require('./helpers/checkmark');
const xmark = require('./helpers/xmark');

/**
 * Every generated component/page is preceded by this
 * @type {string}
 */
const { BACKUPFILE_EXTENSION } = require('../generators/index');

process.chdir(path.join(__dirname, '../generators'));

const plop = nodePlop('./index.js');
const componentGen = plop.getGenerator('component');
const pageGen = plop.getGenerator('page');

/**
 * Every generated component/page is preceded by this
 * @type {string}
 */
const NAMESPACE = 'RbGenerated';

/**
 * Return a prettified string
 * @param {*} data
 * @returns {string}
 */
function prettyStringify(data) {
  return JSON.stringify(data, null, 2);
}

/**
 * Handle results from Plop
 * @param {array} changes
 * @param {array} failures
 * @returns {Promise<*>}
 */
function handleResult({ changes, failures }) {
  return new Promise((resolve, reject) => {
    if (Array.isArray(failures) && failures.length > 0) {
      reject(new Error(prettyStringify(failures)));
    }

    resolve(changes);
  });
}

/**
 * Feedback to user
 * @param {string} info
 * @returns {Function}
 */
function feedbackToUser(info) {
  return result => {
    console.info(chalk.blue(info));
    return result;
  };
}

/**
 * Report success
 * @param {string} message
 * @returns {Function}
 */
function reportSuccess(message) {
  return result => {
    addCheckmark(() => console.log(chalk.green(` ${message}`)));
    return result;
  };
}

/**
 * Report errors
 * @param {string} reason
 * @returns {Function}
 */
function reportErrors(reason) {
  // TODO Replace with our own helpers/log that is guaranteed to be blocking?
  xmark(() => console.error(chalk.red(` ${reason}`)));
  process.exit(1);
}

/**
 * Run eslint on all js files in the given directory
 * @param {string} relativePath
 * @returns {Promise<string>}
 */
function runLintingOnDirectory(relativePath) {
  return new Promise((resolve, reject) => {
    shell.exec(
      `npm run lint:eslint "app/${relativePath}/**/**.js"`,
      {
        silent: true,
      },
      code =>
        code
          ? reject(new Error(`Linting error(s) in ${relativePath}`))
          : resolve(relativePath),
    );
  });
}

/**
 * Run eslint on the given file
 * @param {string} filePath
 * @returns {Promise<string>}
 */
function runLintingOnFile(filePath) {
  return new Promise((resolve, reject) => {
    shell.exec(
      `npm run lint:eslint "${filePath}"`,
      {
        silent: true,
      },
      code => {
        if (code) {
          reject(new Error(`Linting errors in ${filePath}`));
        } else {
          resolve(filePath);
        }
      },
    );
  });
}

/**
 * Remove a directory
 * @param {string} relativePath
 * @returns {Promise<any>}
 */
function removeDir(relativePath) {
  return new Promise((resolve, reject) => {
    try {
      rimraf(path.join(__dirname, '/../../app/', relativePath), err => {
        if (err) throw err;
      });
      resolve(relativePath);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Remove a given file
 * @param {string} filePath
 * @returns {Promise<any>}
 */
function removeFile(filePath) {
  return new Promise((resolve, reject) => {
    try {
      fs.unlink(filePath, err => {
        if (err) throw err;
      });
      resolve(filePath);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Overwrite file from copy
 * @param {string} filePath
 * @param {string} [backupFileExtension=BACKUPFILE_EXTENSION]
 * @returns {Promise<*>}
 */
async function restoreModifiedFile(
  filePath,
  backupFileExtension = BACKUPFILE_EXTENSION,
) {
  return new Promise((resolve, reject) => {
    const targetFile = filePath.replace(`.${backupFileExtension}`, '');
    try {
      fs.copyFile(filePath, targetFile, err => {
        if (err) throw err;
      });
      resolve(targetFile);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Test the component generator and rollback when successful
 * @param {string} name - Component name
 * @param {string} type - Plop Action type
 * @returns {Promise<string>} - Relative path to the generated component
 */
async function generateComponent({ name, memo }) {
  const targetFolder = 'components';
  const componentName = `${NAMESPACE}Component${name}`;
  const relativePath = `${targetFolder}/${componentName}`;
  const component = `component/${memo ? 'Pure' : 'NotPure'}`;

  await componentGen
    .runActions({
      name: componentName,
      memo,
      wantLoadable: true,
    })
    .then(handleResult)
    .then(feedbackToUser(`Generated '${component}'`))
    .catch(reason => reportErrors(reason));
  await runLintingOnDirectory(relativePath)
    .then(reportSuccess(`Linting test passed for '${component}'`))
    .catch(reason => reportErrors(reason));
  await removeDir(relativePath)
    .then(feedbackToUser(`Cleanup '${component}'`))
    .catch(reason => reportErrors(reason));

  return component;
}

/**
 * Test the page generator and rollback when successful
 * @param {string} name - Page name
 * @param {string} type - Plop Action type
 * @returns {Promise<string>} - Relative path to the generated page
 */
async function generatePage({ name, memo }) {
  const targetFolder = 'pages';
  const componentName = `${NAMESPACE}Page${name}`;
  const relativePath = `${targetFolder}/${componentName}`;
  const page = `page/${memo ? 'Pure' : 'NotPure'}`;

  await pageGen
    .runActions({
      name: componentName,
      memo,
      wantHeaders: true,
      wantLoadable: true,
    })
    .then(handleResult)
    .then(feedbackToUser(`Generated '${page}'`))
    .catch(reason => reportErrors(reason));
  await runLintingOnDirectory(relativePath)
    .then(reportSuccess(`Linting test passed for '${page}'`))
    .catch(reason => reportErrors(reason));
  await removeDir(relativePath)
    .then(feedbackToUser(`Cleanup '${page}'`))
    .catch(reason => reportErrors(reason));

  return page;
}

/**
 * Generate components
 * @param {array} components
 * @returns {Promise<[string]>}
 */
async function generateComponents(components) {
  const promises = components.map(async component => {
    let result;

    if (component.kind === 'component') {
      result = await generateComponent(component);
    } else if (component.kind === 'page') {
      result = await generatePage(component);
    }

    return result;
  });

  const results = await Promise.all(promises);

  return results;
}

/**
 * Run
 */
(async function () {
  await generateComponents([
    { kind: 'component', name: 'Component', memo: false },
    { kind: 'component', name: 'MemoizedComponent', memo: true },
    { kind: 'page', name: 'Page', memo: false },
    { kind: 'page', name: 'MemoizedPage', memo: true },
  ]).catch(reason => reportErrors(reason));

})();
