"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-template-curly-in-string */
const steps_1 = require("pojoe/steps");
const testutils_1 = require("./testutils");
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
        onstart: testutils_1.createtree,
        onend: testutils_1.removetree
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
        onstart: testutils_1.createtree,
        onend: testutils_1.removetree
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
        onstart: testutils_1.createtree,
        onend: testutils_1.removetree
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
        onstart: testutils_1.createtree,
        onend: testutils_1.removetree
    },
];
module.exports = steps_1.Testbed.run(tests);
//# sourceMappingURL=DirectoryWalker_spec.js.map