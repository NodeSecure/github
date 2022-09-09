# Github

![version](https://img.shields.io/badge/dynamic/json.svg?style=for-the-badge&url=https://raw.githubusercontent.com/NodeSecure/github/master/package.json&query=$.version&label=Version)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg?style=for-the-badge)](https://github.com/NodeSecure/github/commit-activity)
[![OpenSSF
Scorecard](https://api.securityscorecards.dev/projects/github.com/NodeSecure/github/badge?style=for-the-badge)](https://api.securityscorecards.dev/projects/github.com/NodeSecure/github)
![MIT](https://img.shields.io/github/license/mashape/apistatus.svg?style=for-the-badge)
![known vulnerabilities](https://img.shields.io/snyk/vulnerabilities/github/NodeSecure/github?style=for-the-badge)
![build](https://img.shields.io/github/actions/workflow/status/NodeSecure/github/node.js.yml?style=for-the-badge)

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

const events = await github.getContributorLastActivities({
  owner: "NodeSecure", 
  repository: "scanner",
  contributor: "fraxken",
});
console.log(events);
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
};

export interface DownloadResult {
  /** Archive or repository location on disk */
  location: string;
  /** Github repository name */
  repository: string;
  /** Github organization name */
  organization: string;
}

export interface GetContributorLastActivitiesOptions {
  owner: string,
  repository: string;
  contributor: string;
  token?: string;
}

export type Activity = Record<string, {
  repository: string;
  actualRepo: boolean,
  lastActivity: string;
}>

export type GetContributorLastActivitiesResult = [Activity, Activity];

export function download(repo: string, options?: DownloadOptions): Promise<DownloadResult>;
export function downloadAndExtract(repo: string, options?: ExtractOptions): Promise<DownloadResult>;
export function getContributorLastActivities(options: GetContributorLastActivitiesOptions): Promise<GetContributorLastActivitiesResult | null>;
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

[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://www.linkedin.com/in/thomas-gentilhomme/"><img src="https://avatars.githubusercontent.com/u/4438263?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Gentilhomme</b></sub></a><br /><a href="https://github.com/NodeSecure/github/commits?author=fraxken" title="Code">💻</a> <a href="https://github.com/NodeSecure/github/commits?author=fraxken" title="Documentation">📖</a> <a href="https://github.com/NodeSecure/github/pulls?q=is%3Apr+reviewed-by%3Afraxken" title="Reviewed Pull Requests">👀</a> <a href="#security-fraxken" title="Security">🛡️</a> <a href="https://github.com/NodeSecure/github/issues?q=author%3Afraxken" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/AlexandreMalaj"><img src="https://avatars.githubusercontent.com/u/32218832?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Alexandre Malaj</b></sub></a><br /><a href="https://github.com/NodeSecure/github/commits?author=AlexandreMalaj" title="Code">💻</a> <a href="https://github.com/NodeSecure/github/commits?author=AlexandreMalaj" title="Documentation">📖</a></td>
    <td align="center"><a href="https://www.linkedin.com/in/nicolas-hallaert/"><img src="https://avatars.githubusercontent.com/u/39910164?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Nicolas Hallaert</b></sub></a><br /><a href="https://github.com/NodeSecure/github/commits?author=Rossb0b" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## License

MIT
