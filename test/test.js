require("dotenv").config();

// Require Node.js Dependencies
const { join } = require("path");
const { unlink, access, stat } = require("fs").promises;

// Require Third-party Dependencies
const ava = require("ava");
const is = require("@slimio/is");
const rimraf = require("rimraf");

// Require Internal Dependencies
const download = require("../index");

// CONSTANTS
const GIT_AUTH = `${process.env.GIT_USERNAME}:${process.env.GIT_PASSWORD}`;

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
    assert.is(file, join(__dirname, "Config-master.zip"));
    await access(file);
    await unlink(file);
});

ava("download private repository (without extraction)", async(assert) => {
    const file = await download("SlimIO.Core", {
        dest: __dirname,
        auth: GIT_AUTH
    });
    assert.is(file, join(__dirname, "Core-master.zip"));
    await access(file);
    await unlink(file);
});

ava("download public repository (with extraction)", async(assert) => {
    const dir = await download("SlimIO.is", {
        dest: __dirname,
        extract: true
    });
    assert.is(dir, join(__dirname, "is-master"));
    const st = await stat(dir);
    assert.true(st.isDirectory());

    try {
        await access(join(__dirname, "is-master.zip"));
    }
    catch (err) {
        assert.pass();
    }

    await new Promise((resolve, reject) => {
        rimraf(dir, (error) => {
            if (error) {
                return reject(error);
            }

            return resolve();
        });
    });
});
