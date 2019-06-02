"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-template-curly-in-string */
const steps_1 = require("pojoe/steps");
const tests = [
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
];
module.exports = steps_1.Testbed.run(tests);
//# sourceMappingURL=TextFileReader_spec.js.map