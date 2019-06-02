/* eslint-disable no-template-curly-in-string */
import { Step, Testcase, Testbed } from 'pojoe/steps'
import { createtree, removetree } from './testutils'
import * as fs from 'fs'

const tests: Testcase[] = [
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
                {source: "d:\\tmp\\a\\a.txt", target: "d:\\tmp\\b\\b2.txt" },
                {source: "d:\\tmp\\b\\c\\c.txt", target: "d:\\tmp\\b\\b.txt" },
            ],
        },
        expected: { 
            copied: [
                {source: "d:\\tmp\\a\\a.txt", target: "d:\\tmp\\b\\b2.txt" },
            ],
            failed: [
                {source: "d:\\tmp\\b\\c\\c.txt", target: "d:\\tmp\\b\\b.txt", reason: "EEXIST: file already exists, copyfile 'd:\\tmp\\b\\c\\c.txt' -> 'd:\\tmp\\b\\b.txt'"},
            ],
        },
        onstart: createtree,
        onend: (step:Step) => {
            if (!fs.existsSync("d:\\tmp\\b\\b2.txt")) step.error(`onend(): file not copied ${"d:\\tmp\\b\\b2.txt"}`)
            removetree()
        }
    },
]



module.exports = Testbed.run(tests)

