/* eslint-disable no-template-curly-in-string */
import { Step, Testcase, Testbed } from 'pojoe/steps'
import { createtree, removetree } from './testutils'
import * as fs from 'fs'

const tests: Testcase[] = [
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
        injected: {files : [
            { filename: "./data/simplecsv.csv"}
        ]},
        expected: { pojos: [
            {col1: "aaa", col2: "bbb", col3: "ccc" },
            {col1: "aaaa", col2: "bbbb", col3: "cccc" },
            {col1: "aaaaa", col2: "bbbbb", col3: "ccccc" },
        ]},
    },
]



module.exports = Testbed.run(tests)

