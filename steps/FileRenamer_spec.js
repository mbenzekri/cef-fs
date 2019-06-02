"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-template-curly-in-string */
const steps_1 = require("pojoe/steps");
const testutils_1 = require("./testutils");
const tests = [
    {
        stepid: 'mbenzekri/pojoe-fs/steps/FileRenamer',
        title: 'FileRenamer rename to  non existing / rename to existing',
        params: {
            source: '${pojo.source}',
            target: '${pojo.target}',
        },
        injected: {
            rename: [
                { source: "d:/tmp/b/c/c.txt", target: "d:/tmp/b/c/c1.txt" },
                { source: "d:/tmp/b/c/c.txt", target: "d:/tmp/b/c/c1.txt" },
            ]
        },
        expected: {
            renamed: [
                { source: "d:/tmp/b/c/c.txt", target: "d:/tmp/b/c/c1.txt" },
            ],
            failed: [
                { source: "d:/tmp/b/c/c.txt", target: "d:/tmp/b/c/c1.txt", "reason": "unable to rename file \"d:/tmp/b/c/c.txt\" target file \"d:/tmp/b/c/c1.txt\" exists" },
            ],
        },
        onstart: testutils_1.createtree,
        onend: testutils_1.removetree
    },
];
module.exports = steps_1.Testbed.run(tests);
//# sourceMappingURL=FileRenamer_spec.js.map