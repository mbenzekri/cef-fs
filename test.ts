/* eslint-disable no-template-curly-in-string */
import { Testcase, Testbed } from 'pojoe'
import './DirectoryWalker'

const tests: Testcase[] = [
    {
        stepid: 'mbenzekri/pojoe-fs/steps/DirectoryWalker',
        title: 'DirectoryWalker',
        params: { 
            directory: './.vscode',
            pattern: '.*',
            recursive: 'true',
            outdirs: 'true',
            outfiles: 'true',
        },
        injected: {},
        expected: { 'files': [
            { 'pathname': './vscode/launch.json', isdir:false, isfile:true} 
        ] },
    },
]

Testbed.run(tests)

