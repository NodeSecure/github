# Github API
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/SlimIO/github/commit-activity)
![MIT](https://img.shields.io/github/license/mashape/apistatus.svg)
![V1.0](https://img.shields.io/badge/version-0.3.0-blue.svg)

Download repository from github.

## Getting Started

This package is available in the Node Package Repository and can be easily installed with [npm](https://docs.npmjs.com/getting-started/what-is-npm) or [yarn](https://yarnpkg.com).

```bash
$ npm i @slimio/github
# or
$ yarn add @slimio/github
```

## Usage example
```js
const download = require("@slimio/github");

async function main() {
    const projectZip = await download("SlimIO.is");
    console.log(projectZip);
}
main().catch(console.error);
```

## API

### download(repo: String, options?): Promise< String >
Download a given "public" repository ! Return the name of the .tar.gz file (or the name of the extracted directory).

Repository should be formatted like that:
```
(org|username).repository_fullname
```

Available options:

| name | type | default | description |
| --- | --- | --- | --- |
| branch | string | master | Git branch to download |
| dest | string | `process.cwd()` | Tar/Directory destination |
| extract | boolean | `false` | Extract .tar.gz file |
| auth | string | `undefined` | Basic Authentication for private repository |

## Env
To be able to work on the project, please create a root `.env` file with these:
```
GIT_USERNAME=
GIT_PASSWORD=
```

## License
MIT
