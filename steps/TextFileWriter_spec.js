"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-template-curly-in-string */
const steps_1 = require("pojoe/steps");
const testutils_1 = require("./testutils");
const tests = [
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
        onstart: testutils_1.createtree,
        onend: testutils_1.removetree
    },
];
module.exports = steps_1.Testbed.run(tests);
//# sourceMappingURL=TextFileWriter_spec.js.map