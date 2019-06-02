/* eslint-disable no-template-curly-in-string */
import { Step, Testcase, Testbed } from 'pojoe/steps'
import { createtree, removetree } from './testutils'
import * as fs from 'fs'

const tests: Testcase[] = [
    {
        stepid: 'mbenzekri/pojoe-fs/steps/FileRemover',
        title: 'FileRemover 1 existing / one non existing',
        params: { 
            filename: '${pojo.filename}',
            pattern: '/.*/',
        },
        injected: {
            files : [
                { filename: "d:/tmp/b/c/c.txt"},
                { filename: "d:/tmp/b/c/z.txt"},
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
        onstart: createtree,
        onend: removetree
    },
]



module.exports = Testbed.run(tests)

