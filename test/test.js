import dotenv from "dotenv";
dotenv.config();

// Import Node.js Dependencies
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

// Import Third-party Dependencies
import test from "tape";
import is from "@slimio/is";

// Import Internal Dependencies
import * as github from "../index.js";

// CONSTANTS
const __dirname = dirname(fileURLToPath(import.meta.url));

test("github.download should be an asyncFunction", (tape) => {
  tape.true(is.func(github.download));
  tape.true(is.asyncFunction(github.download));

  tape.end();
});

test("github.downloadAndExtract should be an asyncFunction", (tape) => {
  tape.true(is.func(github.downloadAndExtract));
  tape.true(is.asyncFunction(github.downloadAndExtract));

  tape.end();
});

test("download must throw: repository must be a string!", async(tape) => {
  tape.plan(2);

  try {
    await github.download(10);
  }
  catch (error) {
    tape.strictEqual(error.name, "TypeError");
    tape.strictEqual(error.message, "repository must be a string!");
  }

  tape.end();
});

test("download public repository (without extraction)", async(tape) => {
  const { location, repository, organization } = await github.download("SlimIO.Config", {
    dest: __dirname,
    branch: "master"
  });
  tape.is(repository, "Config");
  tape.is(organization, "SlimIO");
  tape.is(location, join(__dirname, "Config-master.tar.gz"));

  await fs.access(location);
  await fs.unlink(location);

  tape.end();
});

test("download public repository (at current working dir)", async(tape) => {
  const { location } = await github.download("NodeSecure.utils");
  tape.is(location, join(process.cwd(), "utils-main.tar.gz"));

  await fs.access(location);
  await fs.unlink(location);

  tape.end();
});

test("download private repository (without extraction)", async(tape) => {
  const { location } = await github.download("SlimIO.Core", {
    dest: __dirname,
    branch: "master"
  });
  tape.is(location, join(__dirname, "Core-master.tar.gz"));

  await fs.access(location);
  await fs.unlink(location);

  tape.end();
});

test("download public repository (with extraction)", async(tape) => {
  tape.plan(3);

  const { location } = await github.downloadAndExtract("SlimIO.is", {
    dest: __dirname,
    branch: "master"
  });
  tape.is(location, join(__dirname, "is-master"));

  const st = await fs.stat(location);
  tape.true(st.isDirectory());

  try {
    await fs.access(join(__dirname, "is-master.tar.gz"));
  }
  catch {
    tape.pass();
  }

  tape.end();
});

test("download public repository (with extraction and removeArchive disabled)", async(tape) => {
  tape.plan(2);

  const { location } = await github.downloadAndExtract("SlimIO.Safe-emitter", {
    dest: __dirname,
    branch: "master",
    removeArchive: false
  });

  await fs.access(join(__dirname, "Safe-emitter-master.tar.gz"));
  tape.is(location, join(__dirname, "Safe-emitter-master"));
  tape.true((await fs.stat(location)).isDirectory());

  tape.end();
});

test("teardown", async() => {
  await new Promise((resolve) => setTimeout(resolve, 50));

  const dirents = await fs.readdir(__dirname, { withFileTypes: true });
  for (const dirent of dirents) {
    if (dirent.name === "test.js") {
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

test("get contributors last activites for NodeSecure/scanner", async(tape) => {
  const contributors = await github.getContributorsLastActivities("NodeSecure", "scanner");

  tape.true(contributors.has("fraxken"));
});

test("getContributorsLastActivities must throw: repository must be a string!", async(tape) => {
  tape.plan(2);

  try {
    await await github.getContributorsLastActivities("My-fake-owner", 1);
  }
  catch (error) {
    tape.strictEqual(error.name, "TypeError");
    tape.strictEqual(error.message, "repository must be a string!");
  }

  tape.end();
});

test("getContributorsLastActivities must throw: owner must be a string!", async(tape) => {
  tape.plan(2);

  try {
    await await github.getContributorsLastActivities(1, "my-fake-repository");
  }
  catch (error) {
    tape.strictEqual(error.name, "TypeError");
    tape.strictEqual(error.message, "owner must be a string!");
  }

  tape.end();
});
