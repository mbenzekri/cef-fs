/* eslint-disable no-template-curly-in-string */
import { Step, Testcase, Testbed } from 'pojoe/steps'
import { createtree, removetree } from './testutils'
import * as fs from 'fs'

const tests: Testcase[] = [
    {
        stepid: 'mbenzekri/pojoe-fs/steps/DirectoryWalker',
        title: 'DirectoryWalker relative to project directory ',
        params: { 
            directory: '.vscode',
            pattern: '/.*/i',
            recursive: 'true',
            outdirs: 'true',
            outfiles: 'true',
        },
        injected: {},
        expected: { 'files': [
            { 'pathname': '.vscode\\launch.json', isdir:false, isfile:true} 
        ] },
        onstart: createtree,
        onend: removetree
    },
    {
        stepid: 'mbenzekri/pojoe-fs/steps/DirectoryWalker',
        title: 'DirectoryWalker only directories ',
        params: { 
            directory: 'd:/tmp',
            pattern: '/.*/i',
            recursive: 'true',
            outdirs: 'true',
            outfiles: 'false',
        },
        injected: {},
        expected: { 'files': [
            { 'pathname': 'd:\\tmp\\a', isdir:true, isfile:false},
            { 'pathname': 'd:\\tmp\\b', isdir:true, isfile:false},
            { 'pathname': 'd:\\tmp\\b\\c', isdir:true, isfile:false}, 
            { 'pathname': 'd:\\tmp\\d', isdir:true, isfile:false}, 
        ] },
        onstart: createtree,
        onend: removetree
    },
    {
        stepid: 'mbenzekri/pojoe-fs/steps/DirectoryWalker',
        title: 'DirectoryWalker only files ',
        params: { 
            directory: 'd:/tmp',
            pattern: '/.*/i',
            recursive: 'true',
            outdirs: 'false',
            outfiles: 'true',
        },
        injected: {},
        expected: { 'files': [
            { 'pathname': 'd:\\tmp\\a\\a.txt', isdir:false, isfile:true},
            { 'pathname': 'd:\\tmp\\b\\b.txt', isdir:false, isfile:true},
            { 'pathname': 'd:\\tmp\\b\\c\\c.txt', isdir:false, isfile:true}, 
        ] },
        onstart: createtree,
        onend: removetree
    },
    {
        stepid: 'mbenzekri/pojoe-fs/steps/DirectoryWalker',
        title: 'DirectoryWalker with pattern matching',
        params: { 
            directory: 'd:/tmp',
            pattern: '/[c].txt/i',
            recursive: 'true',
            outdirs: 'false',
            outfiles: 'true',
        },
        injected: {},
        expected: { 'files': [
            { 'pathname': 'd:\\tmp\\b\\c\\c.txt', isdir:false, isfile:true}, 
        ] },
        onstart: createtree,
        onend: removetree
    },]



    module.exports = Testbed.run(tests)

