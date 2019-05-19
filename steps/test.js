"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-template-curly-in-string */
const pojoe_1 = require("pojoe");
require("./DirectoryWalker");
const tests = [
    {
        stepid: 'mbenzekri/pojoe-fs/steps/DirectoryWalker',
        title: 'DirectoryWalker',
        params: {
            directory: './.vscode',
            pattern: '.*',
            recursive: 'true',
            outdirs: 'true',
            outfiles: 'true',
        },
        injected: {},
        expected: { 'files': [
                { 'pathname': './vscode/launch.json', isdir: false, isfile: true }
            ] },
    },
];
pojoe_1.Testbed.run(tests);
//# sourceMappingURL=test.js.map