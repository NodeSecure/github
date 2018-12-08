// Require Node.js Dependencies
const { promisify } = require("util");
const { createWriteStream } = require("fs");
const { join } = require("path");
const stream = require("stream");

// Require Third-party Dependencies
const got = require("got");
const is = require("@slimio/is");

// CONSTANTS
const GITHUB_URL = new URL("https://github.com/");

// ASYNC
const pipeline = promisify(stream.pipeline);

/**
 * @async
 * @func download
 * @param {*} repository repository
 * @param {*} options options
 * @param {String} [options.branch=master] branch to download
 * @param {String} [options.dest] destination to transfert file
 * @param {Boolean} [options.extract] Enable .zip extraction!
 * @returns {Promise<String>}
 *
 * @throws {TypeError}
 */
async function download(repository, options = Object.create(null)) {
    if (typeof repository !== "string") {
        throw new TypeError("repository must be a string!");
    }
    if (!is.plainObject(options)) {
        throw new TypeError("options must be a plain javascript object!");
    }

    // Retrieve options
    const { branch = "master", dest = process.cwd(), extract = false } = options;

    // Create URL!
    const [org, repo] = repository.split(".");
    const gitUrl = new URL(`${org}/${repo}/archive/${branch}.zip`, GITHUB_URL);
    console.log(gitUrl);

    const fileDestination = join(dest, `${branch}.zip`);

    await pipeline(
        got.stream(gitUrl.href),
        createWriteStream(fileDestination)
    );

    return fileDestination;
}

module.exports = download;
