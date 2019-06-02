"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-template-curly-in-string */
const steps_1 = require("pojoe/steps");
const testutils_1 = require("./testutils");
const tests = [
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
        onstart: testutils_1.createtree,
        onend: testutils_1.removetree
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
        onstart: testutils_1.createtree,
        onend: testutils_1.removetree
    },
];
module.exports = steps_1.Testbed.run(tests);
//# sourceMappingURL=DirectoryRemover_spec.js.map