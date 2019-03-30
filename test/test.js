require("dotenv").config();

// Require Node.js Dependencies
const { promisify } = require("util");
const { join } = require("path");
const { unlink, access, stat, readdir } = require("fs").promises;

// Require Third-party Dependencies
const ava = require("ava");
const is = require("@slimio/is");
const rimraf = require("rimraf");

// Require Internal Dependencies
const download = require("../index");

// CONSTANTS
const GIT_AUTH = `${process.env.GIT_USERNAME}:${process.env.GIT_PASSWORD}`;
const deleteAll = promisify(rimraf);

// Clean up all files after execution!
ava.after.always(async(assert) => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const files = await readdir(__dirname);
    for (const file of files) {
        if (file === "test.js") {
            continue;
        }

        const fPath = join(__dirname, file);
        const st = await stat(fPath);
        if (st.isDirectory()) {
            await deleteAll(fPath);
        }
        else {
            await unlink(fPath);
        }
    }
});

ava("export should be an asyncFunction", (assert) => {
    assert.true(is.func(download));
    assert.true(is.asyncFunction(download));
});

ava("download must throw: repository must be a string!", async(assert) => {
    await assert.throwsAsync(download(10), {
        instanceOf: TypeError,
        message: "repository must be a string!"
    });
});

ava("download must throw: options must be a plain javascript object!", async(assert) => {
    await assert.throwsAsync(download("SlimIO.Core", false), {
        instanceOf: TypeError,
        message: "options must be a plain javascript object!"
    });
});

ava("download public repository (without extraction)", async(assert) => {
    const file = await download("SlimIO.Config", {
        dest: __dirname
    });
    assert.is(file, join(__dirname, "Config-master.tar.gz"));
    await access(file);
    await unlink(file);
});

ava("download public repository (at current working dir)", async(assert) => {
    const file = await download("SlimIO.Config");
    assert.is(file, join(process.cwd(), "Config-master.tar.gz"));
    await access(file);
    await unlink(file);
});

ava("download private repository (without extraction)", async(assert) => {
    const file = await download("SlimIO.Core", {
        dest: __dirname,
        auth: GIT_AUTH
    });
    assert.is(file, join(__dirname, "Core-master.tar.gz"));
    await access(file);
    await unlink(file);
});

ava("download false repository", async(assert) => {
    assert.plan(2);
    await assert.throwsAsync(download("SlimIO.test", {
        dest: __dirname
    }), { instanceOf: Error, message: "Not Found" });

    try {
        await access(join(__dirname, "test-master.tar.gz"));
    }
    catch (err) {
        console.log(err);
        assert.pass();
    }
});

ava("download public repository (with extraction)", async(assert) => {
    assert.plan(3);
    const dir = await download("SlimIO.is", {
        dest: __dirname,
        extract: true
    });
    assert.is(dir, join(__dirname, "is-master"));
    const st = await stat(dir);
    assert.true(st.isDirectory());

    try {
        await access(join(__dirname, "is-master.tar.gz"));
    }
    catch (err) {
        assert.pass();
    }
});

ava("download public repository (with extraction and unlink disabled)", async(assert) => {
    assert.plan(2);
    const dir = await download("SlimIO.Safe-emitter", {
        dest: __dirname,
        unlink: false,
        extract: true
    });
    await access(join(__dirname, "Safe-emitter-master.tar.gz"));
    assert.is(dir, join(__dirname, "Safe-emitter-master"));
    assert.true((await stat(dir)).isDirectory());
});
