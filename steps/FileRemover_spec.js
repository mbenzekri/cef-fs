"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-template-curly-in-string */
const steps_1 = require("pojoe/steps");
const testutils_1 = require("./testutils");
const tests = [
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
        onstart: testutils_1.createtree,
        onend: testutils_1.removetree
    },
];
module.exports = steps_1.Testbed.run(tests);
//# sourceMappingURL=FileRemover_spec.js.map