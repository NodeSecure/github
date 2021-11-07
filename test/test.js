// Import Node.js Dependencies
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

// Import Third-party Dependencies
import test from "tape";
import is from "@slimio/is";

// Import Internal Dependencies
import { download } from "../index.js";

// CONSTANTS
const __dirname = dirname(fileURLToPath(import.meta.url));

test("export should be an asyncFunction", (tape) => {
  tape.true(is.func(download));
  tape.true(is.asyncFunction(download));

  tape.end();
});

test("download must throw: repository must be a string!", async(tape) => {
  tape.plan(2);

  try {
    await download(10);
  }
  catch (error) {
    tape.strictEqual(error.name, "TypeError");
    tape.strictEqual(error.message, "repository must be a string!");
  }

  tape.end();
});

test("download public repository (without extraction)", async(tape) => {
  const file = await download("SlimIO.Config", {
    dest: __dirname
  });
  tape.is(file, join(__dirname, "Config-master.tar.gz"));

  await fs.access(file);
  await fs.unlink(file);

  tape.end();
});

test("download public repository (at current working dir)", async(tape) => {
  const file = await download("SlimIO.Config");
  tape.is(file, join(process.cwd(), "Config-master.tar.gz"));

  await fs.access(file);
  await fs.unlink(file);

  tape.end();
});

test("download private repository (without extraction)", async(tape) => {
  const file = await download("SlimIO.Core", {
    dest: __dirname,
    auth: process.env.GIT_TOKEN
  });
  tape.is(file, join(__dirname, "Core-master.tar.gz"));

  await fs.access(file);
  await fs.unlink(file);

  tape.end();
});

test("download false repository", async(tape) => {
  tape.plan(2);

  try {
    await download("SlimIO.test", {
      dest: __dirname
    });
  }
  catch (err) {
    console.log(err);

    tape.pass();
  }

  try {
    await fs.access(join(__dirname, "test-master.tar.gz"));
  }
  catch (err) {
    console.log(err);

    tape.pass();
  }

  tape.end();
});

test("download public repository (with extraction)", async(tape) => {
  tape.plan(3);

  const dir = await download("SlimIO.is", {
    dest: __dirname,
    extract: true
  });
  tape.is(dir, join(__dirname, "is-master"));

  const st = await fs.stat(dir);
  tape.true(st.isDirectory());

  try {
    await fs.access(join(__dirname, "is-master.tar.gz"));
  }
  catch {
    tape.pass();
  }

  tape.end();
});

test("download public repository (with extraction and unlink disabled)", async(tape) => {
  tape.plan(2);

  const dir = await download("SlimIO.Safe-emitter", {
    dest: __dirname,
    unlink: false,
    extract: true
  });

  await fs.access(join(__dirname, "Safe-emitter-master.tar.gz"));
  tape.is(dir, join(__dirname, "Safe-emitter-master"));
  tape.true((await fs.stat(dir)).isDirectory());

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
