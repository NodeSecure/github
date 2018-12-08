const downloadGHRepo = require("./index");

async function main() {
    await downloadGHRepo("SlimIO.Nodejs-downloader", {
        dest: "./temp"
    });
}
main().catch(console.error);
