// Require Node.js Dependencies
const { promisify } = require("util");
const { createWriteStream, promises: { unlink, realpath } } = require("fs");
const { join, parse } = require("path");
const stream = require("stream");

// Require Third-party Dependencies
const got = require("got");
const extractZip = require("extract-zip");
const is = require("@slimio/is");

// CONSTANTS
const GITHUB_URL = new URL("https://github.com/");

// ASYNC
const pipeline = promisify(stream.pipeline);
const extractAsync = promisify(extractZip);

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

    const fileDestination = join(dest, `${repo}-${branch}.zip`);
    await pipeline(
        got.stream(gitUrl.href),
        createWriteStream(fileDestination)
    );

    if (extract) {
        await extractAsync(fileDestination, {
            dir: dest
        });
        await unlink(fileDestination);
        const dirParse = parse(fileDestination);

        return join(dirParse.dir, dirParse.name);
    }

    return fileDestination;
}

module.exports = download;
