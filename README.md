# github-download
Download repository from github

## Getting Started

This package is available in the Node Package Repository and can be easily installed with [npm](https://docs.npmjs.com/getting-started/what-is-npm) or [yarn](https://yarnpkg.com).

```bash
$ npm i @slimio/github-download
# or
$ yarn add @slimio/github-download
```

## Usage example
```js
const download = require("@slimio/github-download");

async function main() {
    const projectZip = await download("SlimIO.is");
    console.log(projectZip);
}
main().catch(console.error);
```

## API

### download(repo: String, options?): Promise< String >
Download a given "public" repository ! Return the name of the .zip file (or the name of the extracted directory).

Repository should be formatted like that:
```
(org|username).repository_fullname
```

Available options:
| name | type | default | description |
| --- | --- | --- | --- |
| branch | string | master | Git branch to download |
| dest | string | `process.cwd()` | Zip/Directory destination |
| extract | boolean | false | Extract .zip file |

## Roadmap
- Implement download of private properties
- Complete test coverage
