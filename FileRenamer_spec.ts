/* eslint-disable no-template-curly-in-string */
import { Testcase, Testbed } from 'pojoe/steps'
import { createtree, removetree } from './testutils'

const tests: Testcase[] = [
    {
        stepid: 'mbenzekri/pojoe-fs/steps/FileRenamer',
        title: 'FileRenamer rename to  non existing / rename to existing',
        params: { 
            source: '${pojo.source}',
            target: '${pojo.target}',
        },
        injected: {
            rename : [
                { source: "d:/tmp/b/c/c.txt", target:"d:/tmp/b/c/c1.txt"},
                { source: "d:/tmp/b/c/c.txt", target:"d:/tmp/b/c/c1.txt"},
            ]
        },
        expected: { 
            renamed: [
                { source: "d:/tmp/b/c/c.txt", target:"d:/tmp/b/c/c1.txt"},
            ],
            failed: [
                { source: "d:/tmp/b/c/c.txt", target:"d:/tmp/b/c/c1.txt", "reason": "unable to rename file \"d:/tmp/b/c/c.txt\" target file \"d:/tmp/b/c/c1.txt\" exists" },
            ],
        },
        onstart: createtree,
        onend: removetree
    },
]



module.exports = Testbed.run(tests)

