/* eslint-disable no-template-curly-in-string */
import { Step, Testcase, Testbed } from 'pojoe/steps'
import { createtree, removetree } from './testutils'
import * as fs from 'fs'

const tests: Testcase[] = [
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
        injected: {pojos : [
            {a:1, b:"hello", c: true},
            {a:1, b:"bye", c: true},
        ]},
        expected: { files: [
            { filename: 'd:\\tmp\\tfw.txt'} , 
        ]},
        onstart: createtree,
        onend: removetree
    },
]



module.exports = Testbed.run(tests)

