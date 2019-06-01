"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-template-curly-in-string */
const steps_1 = require("pojoe/steps");
require("./DirectoryWalker");
require("./DirectoryWatcher");
require("./TextFileWriter");
require("./TextFileReader");
require("./FileRemover");
require("./DirectoryRemover");
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
function removetree() {
    fs.existsSync('d:/tmp/tfw.txt') && fs.unlinkSync('d:/tmp/tfw.txt');
    fs.existsSync('d:/tmp/a/a.txt') && fs.unlinkSync('d:/tmp/a/a.txt');
    fs.existsSync('d:/tmp/b/b.txt') && fs.unlinkSync('d:/tmp/b/b.txt');
    fs.existsSync('d:/tmp/b/c/c.txt') && fs.unlinkSync('d:/tmp/b/c/c.txt');
    fs.existsSync('d:/tmp/b/c') && fs.rmdirSync('d:/tmp/b/c');
    fs.existsSync('d:/tmp/a') && fs.rmdirSync('d:/tmp/a');
    fs.existsSync('d:/tmp/b') && fs.rmdirSync('d:/tmp/b');
    fs.existsSync('d:/tmp/d') && fs.rmdirSync('d:/tmp/d');
    fs.existsSync('d:/tmp/tfw.txt') && fs.rmdirSync('d:/tmp/tfw.txt');
    fs.existsSync('d:/tmp') && fs.rmdirSync('d:/tmp');
}
removetree();
const tests = [
    {
        stepid: 'mbenzekri/pojoe-fs/steps/DirectoryWalker',
        title: 'DirectoryWalker relative to project directory ',
        params: {
            directory: '.vscode',
            pattern: '/.*/i',
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
            pattern: '/.*/i',
            recursive: 'true',
            outdirs: 'true',
            outfiles: 'false',
        },
        injected: {},
        expected: { 'files': [
                { 'pathname': 'd:\\tmp\\a', isdir: true, isfile: false },
                { 'pathname': 'd:\\tmp\\b', isdir: true, isfile: false },
                { 'pathname': 'd:\\tmp\\b\\c', isdir: true, isfile: false },
                { 'pathname': 'd:\\tmp\\d', isdir: true, isfile: false },
            ] },
        onstart: createtree,
        onend: removetree
    },
    {
        stepid: 'mbenzekri/pojoe-fs/steps/DirectoryWalker',
        title: 'DirectoryWalker only files ',
        params: {
            directory: 'd:/tmp',
            pattern: '/.*/i',
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
            pattern: '/[c].txt/i',
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
    {
        stepid: 'mbenzekri/pojoe-fs/steps/TextFileWriter',
        title: 'TextFileWriter 2 pojos',
        params: {
            filename: 'd:\\tmp\\tfw.txt',
            createdir: 'true',
            append: 'false',
            textline: '${pojo.a},${pojo.b},${pojo.c}',
            header: '----> HEADER\n',
            footer: '----> FOOTER\n',
        },
        injected: { pojos: [
                { a: 1, b: "hello", c: true },
                { a: 1, b: "bye", c: true },
            ] },
        expected: { files: [
                { filename: 'd:\\tmp\\tfw.txt' },
            ] },
        onstart: createtree,
        onend: removetree
    },
    {
        stepid: 'mbenzekri/pojoe-fs/steps/TextFileReader',
        title: 'TextFileReader 3 pojos',
        params: {
            filename: '${pojo.filename}',
            encoding: 'utf8',
            skip: '1',
            splitter: '/^([^;]*);([^;]*);(.*)$/i',
            pojo: '{ "col1": "${this.match[1] || null }", "col2": "${this.match[2] || null }", "col3": "${this.match[3] || null }"} ',
        },
        injected: { files: [
                { filename: "./data/simplecsv.csv" }
            ] },
        expected: { pojos: [
                { col1: "aaa", col2: "bbb", col3: "ccc" },
                { col1: "aaaa", col2: "bbbb", col3: "cccc" },
                { col1: "aaaaa", col2: "bbbbb", col3: "ccccc" },
            ] },
    },
    {
        stepid: 'mbenzekri/pojoe-fs/steps/FileRemover',
        title: 'FileRemover 1 existing / one non existing',
        params: {
            filename: '${pojo.filename}',
            pattern: '/.*/',
        },
        injected: {
            files: [
                { filename: "d:/tmp/b/c/c.txt" },
                { filename: "d:/tmp/b/c/z.txt" },
            ]
        },
        expected: {
            removed: [
                { filename: "d:/tmp/b/c/c.txt" },
            ],
            failed: [
                { filename: "d:/tmp/b/c/z.txt", "reason": "ENOENT: no such file or directory, unlink 'd:\\tmp\\b\\c\\z.txt'" },
            ],
        },
        onstart: createtree,
        onend: removetree
    },
    {
        stepid: 'mbenzekri/pojoe-fs/steps/DirectoryRemover',
        title: 'DirectoryRemover 1 empty / 1 recusively',
        params: {
            dirname: '${pojo.dirname}',
            pattern: '/.*/i',
            recursive: 'false',
        },
        injected: {
            directories: [
                { dirname: "d:/tmp/d" },
                { dirname: "d:/tmp/b" },
            ]
        },
        expected: {
            removed: [
                { dirname: "d:/tmp/d" },
            ],
            failed: [
                { dirname: "d:/tmp/b", reason: "ENOTEMPTY: directory not empty, rmdir 'd:\\tmp\\b'" },
            ],
        },
        onstart: createtree,
        onend: removetree
    },
    {
        stepid: 'mbenzekri/pojoe-fs/steps/DirectoryRemover',
        title: 'DirectoryRemover 1 dir not empty and no recursive flag set',
        params: {
            dirname: '${pojo.dirname}',
            pattern: '/.*/i',
            recursive: 'false',
        },
        injected: {
            directories: [
                { dirname: "d:/tmp/a" },
            ]
        },
        expected: {
            removed: [],
            failed: [
                { dirname: "d:/tmp/a", reason: "ENOTEMPTY: directory not empty, rmdir 'd:\\tmp\\a'" },
            ],
        },
        onstart: createtree,
        onend: removetree
    },
    {
        stepid: 'mbenzekri/pojoe-fs/steps/DirectoryWatcher',
        title: 'DirectoryWatcher create one file remove 1 file ',
        params: {
            directory: 'd:/tmp/d',
            pattern: '/.*/i',
            created: 'true',
            deleted: 'true',
        },
        injected: {},
        expected: {
            files: [
                { filename: "d:\\tmp\\d\\d.txt", change: 'create', isdir: false, isfile: true },
                { filename: "d:\\tmp\\d\\d.txt", change: 'delete', isdir: false, isfile: false },
            ],
        },
        onstart: (directorywatcher) => {
            createtree();
            setTimeout(() => fs.writeFileSync('d:/tmp/d/d.txt', 'Hello world !!!'), 1000);
            setTimeout(() => fs.unlinkSync('d:/tmp/d/d.txt'), 2000);
            setTimeout(() => directorywatcher.stopwatch(), 3000);
        },
        onend: removetree
    },
];
steps_1.Testbed.run(tests);
//# sourceMappingURL=test.js.map