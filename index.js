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
const kGithubApi = new URL("https://api.github.com/");
const kDefaultBranch = "main";

// VARS
let GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? void 0;

/**
 * @example
 * const { location } = await github.download("NodeSecure.utils", {
 *  dest: __dirname
 * });
 * console.log(location);
 */
export async function download(repository, options = Object.create(null)) {
  if (typeof repository !== "string") {
    throw new TypeError("repository must be a string!");
  }
  const { branch = kDefaultBranch, dest = process.cwd(), token } = options;

  // Create URL!
  const [organization, repo] = repository.split(".");
  const repositoryURL = new URL(`${organization}/${repo}/archive/${branch}.tar.gz`, kGithubURL);
  const location = path.join(dest, `${repo}-${branch}.tar.gz`);

  await httpie.stream("GET", repositoryURL, {
    headers: {
      "User-Agent": "NodeSecure",
      "Accept-Encoding": "gzip, deflate",
      Authorization: typeof token === "string" ? `token ${token}` : GITHUB_TOKEN
    },
    maxRedirections: 1
  })(createWriteStream(location));

  return {
    location,
    organization,
    repository: repo
  };
}

/**
 * @example
 * const { location } = await github.downloadAndExtract("NodeSecure.utils", {
 *  removeArchive: false
 * });
 * console.log(location);
 */
export async function downloadAndExtract(repository, options = Object.create(null)) {
  const { removeArchive = true, ...downloadOptions } = options;
  const { branch = kDefaultBranch, dest = process.cwd(), token } = downloadOptions;

  const result = await download(repository, { branch, dest, token });

  await pipeline(
    createReadStream(result.location),
    createGunzip(),
    tar.extract(dest)
  );

  if (removeArchive) {
    await fs.unlink(result.location);
  }

  result.location = path.join(dest, `${result.repository}-${branch}`);

  return result;
}

export async function getContributorsLastActivities(owner, repository, options = Object.create(null)) {
  if (typeof owner !== "string") {
    throw new TypeError(`owner must be a string, but got ${owner}`);
  }

  if (typeof repository !== "string") {
    throw new TypeError(`repository must be a string, but got ${repository}`);
  }

  const { token } = options;

  const contributorsUrl = new URL(`repos/${owner}/${repository}/contributors`, kGithubApi);

  try {
    const { data } = await httpie.get(contributorsUrl, {
      headers: {
        "User-Agent": "NodeSecure",
        Authorization: typeof token === "string" ? `token ${token}` : GITHUB_TOKEN
      },
      maxRedirections: 1
    });

    const contributors = data.filter((contributor) => !/bot/.test(contributor.login))
      .map((contributor) => hydrateLastActivities(contributor.login, owner, repository));

    const lastActivities = new Map(await Promise.all(contributors));

    return lastActivities;
  }
  catch (error) {
    return null;
  }
}

async function hydrateLastActivities(contributor, owner, repository) {
  const formatedRepositoryName = `${owner}/${repository}`;

  const eventsUrl = new URL(`users/${contributor}/events`, kGithubApi);

  const { data } = await httpie.get(eventsUrl, {
    headers: {
      "User-Agent": "NodeSecure",
      Authorization: typeof token === "string" ? `token ${token}` : GITHUB_TOKEN
    },
    maxRedirections: 1
  });

  function getLastEvents(events) {
    const lastEvent = events[0];
    const lastRelatedEvent = events.find((event) => event.repo.name === formatedRepositoryName);

    if (lastEvent.repo.name === formatedRepositoryName) {
      return [lastEvent];
    }

    return lastRelatedEvent ?
      [lastEvent, lastRelatedEvent] : [lastEvent];
  }

  return [contributor,
    [...getLastEvents(data)]
      .map((event) => {
        return {
          repository: event.repo.name,
          actualRepo: event.repo.name === formatedRepositoryName,
          lastActivity: event.created_at
        };
      })
  ];
}

export function setToken(githubToken) {
  GITHUB_TOKEN = githubToken;
}
