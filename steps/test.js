"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-template-curly-in-string */
const steps_1 = require("pojoe/steps");
require("./DirectoryWalker");
require("./DirectoryWatcher");
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
    // create <x>.txt file in each correspondig directory
    fs.existsSync('d:/tmp/a/a.txt') || fs.writeFileSync('d:/tmp/a/a.txt', 'aaa file');
    fs.existsSync('d:/tmp/b/b.txt') || fs.writeFileSync('d:/tmp/b/b.txt', 'bbb file');
    fs.existsSync('d:/tmp/b/c/c.txt') || fs.writeFileSync('d:/tmp/b/c/c.txt', 'ccc file');
}
function removetree() {
    fs.existsSync('d:/tmp/a/a.txt') && fs.unlinkSync('d:/tmp/a/a.txt');
    fs.existsSync('d:/tmp/b/b.txt') && fs.unlinkSync('d:/tmp/b/b.txt');
    fs.existsSync('d:/tmp/b/c/c.txt') && fs.unlinkSync('d:/tmp/b/c/c.txt');
    fs.existsSync('d:/tmp/b/c') && fs.rmdirSync('d:/tmp/b/c');
    fs.existsSync('d:/tmp/a') && fs.rmdirSync('d:/tmp/a');
    fs.existsSync('d:/tmp/b') && fs.rmdirSync('d:/tmp/b');
    fs.existsSync('d:/tmp') && fs.rmdirSync('d:/tmp');
}
removetree();
const tests = [
    {
        stepid: 'mbenzekri/pojoe-fs/steps/DirectoryWalker',
        title: 'DirectoryWalker relative to project directory ',
        params: {
            directory: '.vscode',
            pattern: '.*',
            recursive: 'true',
            outdirs: 'true',
            outfiles: 'true',
        },
        injected: {},
        expected: { 'files': [
                { 'pathname': '.vscode\\launch.json', isdir: false, isfile: true }
            ] },
        onstart: createtree,
        onend: removetree
    },
    {
        stepid: 'mbenzekri/pojoe-fs/steps/DirectoryWalker',
        title: 'DirectoryWalker only directories ',
        params: {
            directory: 'd:/tmp',
            pattern: '.*',
            recursive: 'true',
            outdirs: 'true',
            outfiles: 'false',
        },
        injected: {},
        expected: { 'files': [
                { 'pathname': 'd:\\tmp\\a', isdir: true, isfile: false },
                { 'pathname': 'd:\\tmp\\b', isdir: true, isfile: false },
                { 'pathname': 'd:\\tmp\\b\\c', isdir: true, isfile: false },
            ] },
        onstart: createtree,
        onend: removetree
    },
    {
        stepid: 'mbenzekri/pojoe-fs/steps/DirectoryWalker',
        title: 'DirectoryWalker only files ',
        params: {
            directory: 'd:/tmp',
            pattern: '.*',
            recursive: 'true',
            outdirs: 'false',
            outfiles: 'true',
        },
        injected: {},
        expected: { 'files': [
                { 'pathname': 'd:\\tmp\\a\\a.txt', isdir: false, isfile: true },
                { 'pathname': 'd:\\tmp\\b\\b.txt', isdir: false, isfile: true },
                { 'pathname': 'd:\\tmp\\b\\c\\c.txt', isdir: false, isfile: true },
            ] },
        onstart: createtree,
        onend: removetree
    },
    {
        stepid: 'mbenzekri/pojoe-fs/steps/DirectoryWalker',
        title: 'DirectoryWalker with pattern matching',
        params: {
            directory: 'd:/tmp',
            pattern: '[c].txt',
            recursive: 'true',
            outdirs: 'false',
            outfiles: 'true',
        },
        injected: {},
        expected: { 'files': [
                { 'pathname': 'd:\\tmp\\b\\c\\c.txt', isdir: false, isfile: true },
            ] },
        onstart: createtree,
        onend: removetree
    },
];
steps_1.Testbed.run(tests).then(() => console.log('TEST TERMINATED')).catch(() => console.log('TEST TERMINATED'));
//# sourceMappingURL=test.js.map