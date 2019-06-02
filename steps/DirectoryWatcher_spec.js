"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-template-curly-in-string */
const steps_1 = require("pojoe/steps");
const testutils_1 = require("./testutils");
const fs = require("fs");
const tests = [
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
            testutils_1.createtree();
            setTimeout(() => fs.writeFileSync('d:/tmp/d/d.txt', 'Hello world !!!'), 1000);
            setTimeout(() => fs.unlinkSync('d:/tmp/d/d.txt'), 2000);
            setTimeout(() => directorywatcher.stopwatch(), 3000);
        },
        onend: testutils_1.removetree
    },
];
module.exports = steps_1.Testbed.run(tests);
//# sourceMappingURL=DirectoryWatcher_spec.js.map