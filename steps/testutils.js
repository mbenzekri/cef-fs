"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-template-curly-in-string */
const fs = require("fs");
function createtree() {
    // create folowwing dir tree
    // d:/tmp 
    //  +- a
    //  +- b 
    //     +- c
    fs.existsSync('d:/tmp') || fs.mkdirSync('d:/tmp');
    fs.existsSync('d:/tmp/a') || fs.mkdirSync('d:/tmp/a');
    fs.existsSync('d:/tmp/b') || fs.mkdirSync('d:/tmp/b');
    fs.existsSync('d:/tmp/b/c') || fs.mkdirSync('d:/tmp/b/c');
    fs.existsSync('d:/tmp/d') || fs.mkdirSync('d:/tmp/d');
    // create <x>.txt file in each correspondig directory a,b,c and d stay empty
    fs.existsSync('d:/tmp/a/a.txt') || fs.writeFileSync('d:/tmp/a/a.txt', 'aaa file');
    fs.existsSync('d:/tmp/b/b.txt') || fs.writeFileSync('d:/tmp/b/b.txt', 'bbb file');
    fs.existsSync('d:/tmp/b/c/c.txt') || fs.writeFileSync('d:/tmp/b/c/c.txt', 'ccc file');
}
exports.createtree = createtree;
function removetree() {
    fs.existsSync('d:/tmp/tfw.txt') && fs.unlinkSync('d:/tmp/tfw.txt');
    fs.existsSync('d:/tmp/a/a.txt') && fs.unlinkSync('d:/tmp/a/a.txt');
    fs.existsSync('d:/tmp/b/b.txt') && fs.unlinkSync('d:/tmp/b/b.txt');
    fs.existsSync('d:/tmp/b/b2.txt') && fs.unlinkSync('d:/tmp/b/b2.txt');
    fs.existsSync('d:/tmp/b/c/c.txt') && fs.unlinkSync('d:/tmp/b/c/c.txt');
    fs.existsSync('d:/tmp/b/c') && fs.rmdirSync('d:/tmp/b/c');
    fs.existsSync('d:/tmp/a') && fs.rmdirSync('d:/tmp/a');
    fs.existsSync('d:/tmp/b') && fs.rmdirSync('d:/tmp/b');
    fs.existsSync('d:/tmp/d') && fs.rmdirSync('d:/tmp/d');
    fs.existsSync('d:/tmp/tfw.txt') && fs.rmdirSync('d:/tmp/tfw.txt');
    fs.existsSync('d:/tmp') && fs.rmdirSync('d:/tmp');
}
exports.removetree = removetree;
removetree();
//# sourceMappingURL=testutils.js.map