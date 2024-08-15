// Import Node.js Dependencies
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";
import { describe, before, test } from "node:test";
import assert from "node:assert";
import * as timers from "node:timers/promises";

// Import Third-party Dependencies
import is from "@slimio/is";

// Import Internal Dependencies
import * as github from "../src/index.js";

// CONSTANTS
const __dirname = dirname(fileURLToPath(import.meta.url));

test("github.download should be an asyncFunction", () => {
  assert.equal(is.func(github.download), true);
  assert.equal(is.asyncFunction(github.download), true);
});

test("github.downloadAndExtract should be an asyncFunction", () => {
  assert.equal(is.func(github.downloadAndExtract), true);
  assert.equal(is.asyncFunction(github.downloadAndExtract), true);
});

test("download must throw: repository must be a string!", () => {
  assert.rejects(
    async() => await github.download(10 as any),
    {
      name: "TypeError",
      message: "repository must be a string!"
    }
  );
});

test("download public repository (without extraction)", async() => {
  const { location, repository, organization } = await github.download("SlimIO.Config", {
    dest: __dirname,
    branch: "master"
  });
  assert.equal(repository, "Config");
  assert.equal(organization, "SlimIO");
  assert.equal(location, join(__dirname, "Config-master.tar.gz"));

  await fs.access(location);
  await fs.unlink(location);
});

test("download public repository (at current working dir)", async() => {
  const { location } = await github.download("NodeSecure.utils");
  assert.equal(location, join(process.cwd(), "utils-main.tar.gz"));

  await fs.access(location);
  await fs.unlink(location);
});

test("download private repository (without extraction)", async() => {
  const { location } = await github.download("SlimIO.Core", {
    dest: __dirname,
    branch: "master"
  });
  assert.equal(location, join(__dirname, "Core-master.tar.gz"));

  await fs.access(location);
  await fs.unlink(location);
});

describe("download public repository (with extraction)", () => {
  let location;

  before(async() => {
    const result = await github.downloadAndExtract("SlimIO.is", {
      dest: __dirname,
      branch: "master"
    });
    location = result.location;
  });

  test("should have the correct download location", async() => {
    assert.equal(location, join(__dirname, "is-master"));
  });

  test("should be a directory", async() => {
    const st = await fs.stat(location);
    assert.ok(st.isDirectory());
  });

  test("should not have the tar.gz file", async() => {
    const filePath = join(__dirname, "is-master.tar.gz");
    assert.rejects(
      async() => await fs.access(filePath),
      {
        name: "Error",
        code: "ENOENT",
        message: /no such file or directory/
      }
    );
  });
});

test("download public repository (with extraction and removeArchive disabled)", async() => {
  const { location } = await github.downloadAndExtract("SlimIO.Safe-emitter", {
    dest: __dirname,
    branch: "master",
    removeArchive: false
  });

  await fs.access(join(__dirname, "Safe-emitter-master.tar.gz"));
  assert.equal(location, join(__dirname, "Safe-emitter-master"));
  assert.equal((await fs.stat(location)).isDirectory(), true);
});

test("teardown", async() => {
  await timers.setTimeout(50);

  const dirents = await fs.readdir(__dirname, { withFileTypes: true });
  for (const dirent of dirents) {
    if (dirent.name === "index.spec.ts") {
      continue;
    }

    const fullPath = join(__dirname, dirent.name);
    if (dirent.isDirectory()) {
      await fs.rm(fullPath, { recursive: true, force: true });
    }
    else {
      await fs.unlink(fullPath);
    }
  }
});
