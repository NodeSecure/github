# Github API

![version](https://img.shields.io/badge/dynamic/json.svg?url=https://raw.githubusercontent.com/NodeSecure/github/master/package.json&query=$.version&label=Version)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/NodeSecure/github/commit-activity)
![MIT](https://img.shields.io/github/license/mashape/apistatus.svg)
[![Known Vulnerabilities](https://snyk.io/test/github/NodeSecure/github/badge.svg?targetFile=package.json)](https://snyk.io/test/github/SlimIO/github?targetFile=package.json)

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

const tarGZPath = await github.download("NodeSecure.utils");
console.log(tarGZPath);

const extractedDirLocation = await github.downloadAndExtract("NodeSecure.scanner");
console.log(extractedDirLocation);
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
  /** Authentication token for private repositories */
  auth?: string;
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

export function download(repo: string, options?: DownloadOptions): Promise<DownloadResult>;
export function downloadAndExtract(repo: string, options?: ExtractOptions): Promise<DownloadResult>;
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

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## License
MIT
