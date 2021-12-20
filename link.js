"use strict";
/**********************************************************************
 * Copyright (c) 2018-2021 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 ***********************************************************************/
/**
 * A command to yarn link theia dependencies into an application
 * @author Thomas Mäder
 */
const fs = require("fs-extra");
const os = require("os");
const path = require("path");
const cp= require("child_process");
const util= require("util");

async function handleCommand(args) {
    const theiaDir = args[0] || path.resolve(process.cwd(), '../theia');
    const appDir = process.cwd();
    const cfg = await exec(appDir, 'yarn --silent --json --non-interactive config current');
    try {
        console.info(cfg);
        console.info(JSON.parse(cfg));
        const yarnConfig = JSON.parse(JSON.parse(cfg).data);
        let linkDir = yarnConfig['linkFolder'] || path.resolve(os.homedir(), '.yarn/link');
        await fs.ensureDir(linkDir);
        linkDir = await fs.realpath(linkDir);
        await link(appDir, theiaDir, linkDir);
    }
    catch (e) {
        console.error(e);
    }
}

async function exec(directory, cmdLine) {
    return new Promise((resolve, reject) => {
        const execProcess = cp.exec(
            cmdLine,
            {
                cwd: directory,
                maxBuffer: 1024 * 1024,
            },
            (error, stdout, stderr) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const exitCode = execProcess.exitCode;
                if (error) {
                    reject(new CliError('Unable to execute the command ' + cmdLine + ': ' + error));
                }
                if (exitCode !== 0) {
                    reject(new CliError('Invalid exit code ' + exitCode));
                }
                resolve(stdout);
            }
        );
    });
}

async function link(appRootPath, theiaProjectPath, yarnLinkFolder) {
    await linkTheia(yarnLinkFolder, theiaProjectPath);
    await linkApp(yarnLinkFolder, appRootPath);
}

async function linkTheia(yarnLinkFolder, theiaProjectPath) {
    for (const rootName of ['packages', 'dev-packages', 'examples']) {
        const rootPath = path.resolve(theiaProjectPath, rootName);
        const folderNames = await fs.readdir(rootPath);
        for (const folderName of folderNames) {
            await exec(path.resolve(rootPath, folderName), `yarn link --link-folder=${yarnLinkFolder}`);
        }
    }
}
async function linkApp(yarnLinkFolder, appRootPath) {
    const packages = await fs.readdir(path.resolve(yarnLinkFolder, '@theia'));
    for (const pkg of packages) {
        await exec(appRootPath, `yarn link @theia/${pkg}`);
    }
}

handleCommand(process.argv.slice(2));