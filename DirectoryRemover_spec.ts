/* eslint-disable no-template-curly-in-string */
import { Step, Testcase, Testbed } from 'pojoe/steps'
import { createtree, removetree } from './testutils'
import * as fs from 'fs'

const tests: Testcase[] = [
    {
        stepid: 'mbenzekri/pojoe-fs/steps/DirectoryRemover',
        title: 'DirectoryRemover 1 empty / 1 recusively',
        params: { 
            dirname: '${pojo.dirname}',
            pattern: '/.*/i',
            recursive: 'false',
        },
        injected: {
            directories : [
                { dirname: "d:/tmp/d"},
                { dirname: "d:/tmp/b"},
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
        onstart: createtree,
        onend: removetree
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
            directories : [
                { dirname: "d:/tmp/a"},
            ]
        },
        expected: { 
            removed: [
            ],
            failed: [
                { dirname: "d:/tmp/a", reason: "ENOTEMPTY: directory not empty, rmdir 'd:\\tmp\\a'" },
            ],
        },
        onstart: createtree,
        onend: removetree
    },
]



module.exports = Testbed.run(tests)

