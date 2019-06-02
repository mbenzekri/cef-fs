"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-template-curly-in-string */
const steps_1 = require("pojoe/steps");
const testutils_1 = require("./testutils");
const fs = require("fs");
const tests = [
    {
        stepid: 'mbenzekri/pojoe-fs/steps/FileCopier',
        title: 'FileCopier copy one file target not exists / copy one file target exists',
        params: {
            source: '${pojo.source}',
            target: '${pojo.target}',
            exclusive: 'true',
        },
        injected: {
            copy: [
                { source: "d:\\tmp\\a\\a.txt", target: "d:\\tmp\\b\\b2.txt" },
                { source: "d:\\tmp\\b\\c\\c.txt", target: "d:\\tmp\\b\\b.txt" },
            ],
        },
        expected: {
            copied: [
                { source: "d:\\tmp\\a\\a.txt", target: "d:\\tmp\\b\\b2.txt" },
            ],
            failed: [
                { source: "d:\\tmp\\b\\c\\c.txt", target: "d:\\tmp\\b\\b.txt", reason: "EEXIST: file already exists, copyfile 'd:\\tmp\\b\\c\\c.txt' -> 'd:\\tmp\\b\\b.txt'" },
            ],
        },
        onstart: testutils_1.createtree,
        onend: (step) => {
            if (!fs.existsSync("d:\\tmp\\b\\b2.txt"))
                step.error(`onend(): file not copied ${"d:\\tmp\\b\\b2.txt"}`);
            testutils_1.removetree();
        }
    },
];
module.exports = steps_1.Testbed.run(tests);
//# sourceMappingURL=FileCopier_spec.js.map