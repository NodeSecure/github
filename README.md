# Github

![version](https://img.shields.io/badge/dynamic/json.svg?url=https://raw.githubusercontent.com/NodeSecure/github/master/package.json&query=$.version&label=Version)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/NodeSecure/github/commit-activity)
![MIT](https://img.shields.io/github/license/mashape/apistatus.svg)
[![Known Vulnerabilities](https://snyk.io/test/github/NodeSecure/github/badge.svg?targetFile=package.json)](https://snyk.io/test/github/SlimIO/github?targetFile=package.json)
![build](https://img.shields.io/github/workflow/status/NodeSecure/github/Node.js%20CI)

Download and (optionaly) extract github repository archive.

## Requirements
- [Node.js](https://nodejs.org/en/) v16 or higher

## Getting Started

This package is available in the Node Package Repository and can be easily installed with [npm](https://docs.npmjs.com/getting-started/what-is-npm) or [yarn](https://yarnpkg.com).

```bash
$ npm i @nodesecure/github
# or
$ yarn add @nodesecure/github
```

## Usage example
```js
import * as github from "@nodesecure/github";

const utils = await github.download("NodeSecure.utils");
console.log(utils.location);

const scanner = await github.downloadAndExtract("NodeSecure.scanner");
console.log(scanner.location);

const contributors = await github.getContributorsLastActivities("NodeSecure", "scanner");
console.log(contributors);
```

## API

```ts
export interface DownloadOptions {
  /**
   * The destination (location) to extract the tar.gz
   *
   * @default process.cwd()
   */
  dest?: string;
  /**
   * The default github branch name (master, main ...)
   *
   * @default main
   */
  branch?: string;
  /**
   * Authentication token for private repositories
   *
   * @default process.env.GITHUB_TOKEN
   */
  token?: string;
}

export type ExtractOptions = DownloadOptions & {
  /**
   * Remove the tar.gz archive after a succesfull extraction
   *
   * @default true
   */
  removeArchive?: boolean;
}

export interface DownloadResult {
  /** Archive or repository location on disk */
  location: string;
  /** Github repository name */
  repository: string;
  /** Github organization name */
  organization: string;
}

export interface GetContributorsLastActivities {
  token?: string;
}

export interface GetContributorsLastActivitiesResult {
  [key: string]: {
    repository: string;
    actualRepo: boolean,
    lastActivity: string;
  }[];
}
export function download(repo: string, options?: DownloadOptions): Promise<DownloadResult>;
export function downloadAndExtract(repo: string, options?: ExtractOptions): Promise<DownloadResult>;
export function getContributorsLastActivities(
  owner: string,
  repository: string,
  options?: GetContributorsLastActivities
): Promise<GetContributorsLastActivitiesResult>;
export function setToken(githubToken: string): void;
```

### Private repositories
To work with private repositories you can either setup a `GITHUB_TOKEN` system variable or use `setToken` method:

```js
import * as github from "@nodesecure/github";

github.setToken("...");
```

## Contributors ✨

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://www.linkedin.com/in/thomas-gentilhomme/"><img src="https://avatars.githubusercontent.com/u/4438263?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Gentilhomme</b></sub></a><br /><a href="https://github.com/NodeSecure/github/commits?author=fraxken" title="Code">💻</a> <a href="https://github.com/NodeSecure/github/commits?author=fraxken" title="Documentation">📖</a> <a href="https://github.com/NodeSecure/github/pulls?q=is%3Apr+reviewed-by%3Afraxken" title="Reviewed Pull Requests">👀</a> <a href="#security-fraxken" title="Security">🛡️</a> <a href="https://github.com/NodeSecure/github/issues?q=author%3Afraxken" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/AlexandreMalaj"><img src="https://avatars.githubusercontent.com/u/32218832?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Alexandre Malaj</b></sub></a><br /><a href="https://github.com/NodeSecure/github/commits?author=AlexandreMalaj" title="Code">💻</a> <a href="https://github.com/NodeSecure/github/commits?author=AlexandreMalaj" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## License
MIT
