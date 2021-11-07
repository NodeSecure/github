// Import Node.js Dependencies
import { createWriteStream, createReadStream } from "fs";
import fs from "fs/promises";
import path from "path";
import { createGunzip } from "zlib";
import { pipeline } from "stream/promises";

// Import Third-party Dependencies
import tar from "tar-fs";
import httpie from "@myunisoft/httpie";

// CONSTANTS
const kGithubURL = new URL("https://github.com/");
const kDefaultBranch = "main";

export async function download(repository, options = Object.create(null)) {
  if (typeof repository !== "string") {
    throw new TypeError("repository must be a string!");
  }
  const { branch = kDefaultBranch, dest = process.cwd(), auth } = options;

  // Create URL!
  const [org, repo] = repository.split(".");
  const repositoryURL = new URL(`${org}/${repo}/archive/${branch}.tar.gz`, kGithubURL);
  const fileDestination = path.join(dest, `${repo}-${branch}.tar.gz`);

  await httpie.stream("GET", repositoryURL, {
    headers: {
      "User-Agent": "NodeSecure",
      "Accept-Encoding": "gzip, deflate",
      Authorization: typeof auth === "string" ? `token ${auth}` : void 0
    },
    maxRedirections: 1
  })(createWriteStream(fileDestination));

  return fileDestination;
}

export async function downloadAndExtract(repository, options) {
  const { removeArchive = true, ...downloadOptions } = options;
  const { branch = kDefaultBranch, dest = process.cwd(), auth } = downloadOptions;

  const fileDestination = await download(repository, { branch, dest, auth });

  await pipeline(
    createReadStream(fileDestination),
    createGunzip(),
    tar.extract(dest)
  );
  if (removeArchive) {
    await fs.unlink(fileDestination);
  }

  const [, repo] = repository.split(".");

  return path.join(dest, `${repo}-${branch}`);
}
