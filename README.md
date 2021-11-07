# Github API

![version](https://img.shields.io/badge/dynamic/json.svg?url=https://raw.githubusercontent.com/NodeSecure/github/master/package.json&query=$.version&label=Version)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/NodeSecure/github/commit-activity)
![MIT](https://img.shields.io/github/license/mashape/apistatus.svg)
[![Known Vulnerabilities](https://snyk.io/test/github/NodeSecure/github/badge.svg?targetFile=package.json)](https://snyk.io/test/github/SlimIO/github?targetFile=package.json)

Download and (optionaly) extract github repository archive.

## Requirements
- [Node.js](https://nodejs.org/en/) v14 or higher

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

export type FileSystemPath = string;

export function download(repo: string, options?: DownloadOptions): Promise<FileSystemPath>;
export function downloadAndExtract(repo: string, options?: ExtractOptions): Promise<FileSystemPath>;
```

## Env
To be able to work on the project, please create a root `.env` file with these:
```
GIT_TOKEN=token_here
```

## License
MIT
