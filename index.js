// Require Node.js Dependencies
const { promisify } = require("util");
const { createWriteStream, createReadStream, promises: { unlink } } = require("fs");
const { join } = require("path");
const { createGunzip } = require("zlib");
const stream = require("stream");

// Require Third-party Dependencies
const got = require("got");
const tar = require("tar-fs");
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
 * @param {String} [options.auth] auth for private repository
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
    const { branch = "master", dest = process.cwd(), extract = false, auth } = options;

    // Create URL!
    const [org, repo] = repository.split(".");
    const gitUrl = new URL(`${org}/${repo}/archive/${branch}.tar.gz`, GITHUB_URL);
    const fileDestination = join(dest, `${repo}-${branch}.tar.gz`);

    // Download and write on disk
    await pipeline(
        got.stream(gitUrl.href, { auth, timeout: 2000 }),
        createWriteStream(fileDestination)
    );

    // // Extract .tar.gz archive
    if (extract) {
        await pipeline(
            createReadStream(fileDestination),
            createGunzip(),
            tar.extract(dest)
        );
        await unlink(fileDestination);

        return join(dest, `${repo}-${branch}`);
    }

    return fileDestination;
}

module.exports = download;
