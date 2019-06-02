/* eslint-disable no-template-curly-in-string */
import { Step, Testcase, Testbed } from 'pojoe/steps'
import { createtree, removetree } from './testutils'
import * as fs from 'fs'

const tests: Testcase[] = [
    {
        stepid: 'mbenzekri/pojoe-fs/steps/DirectoryWatcher',
        title: 'DirectoryWatcher create one file remove 1 file ',
        params: { 
            directory: 'd:/tmp/d',
            pattern: '/.*/i',
            created: 'true',
            deleted: 'true',
        },
        injected: {
        },
        expected: { 
            files: [
                {filename: "d:\\tmp\\d\\d.txt", change: 'create', isdir: false, isfile: true },
                {filename: "d:\\tmp\\d\\d.txt", change: 'delete', isdir: false, isfile: false },
            ],
        },
        onstart: (directorywatcher: Step ) => { 
            createtree();
            setTimeout(() => fs.writeFileSync('d:/tmp/d/d.txt','Hello world !!!'),1000)
            setTimeout(() => fs.unlinkSync('d:/tmp/d/d.txt'),2000)
            setTimeout(() => (<any>directorywatcher).stopwatch(),3000)
        },
        onend: removetree
    },
]



module.exports = Testbed.run(tests)

