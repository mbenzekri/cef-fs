import { Declaration, Step, ParamsMap } from 'pojoe/steps'
import { walk } from './tools'

const declaration: Declaration = {
    gitid: 'mbenzekri/pojoe-fs/steps/DirectoryWalker',
    title: 'directory tree recursive walk',
    desc: 'this step does a tree recursive walk and outputs each directories and/or files found',
    features: [
        "allow file search through a directory walking ",
        "allow recursive or flat walk",
        "allow type file/directory filter",
        "allow regexp filtering for full pathname directories and/or files",
    ],
    inputs: {},
    outputs: {
        'files': {
            title: 'for each selected file or directory a pojo is outputed through this port',
            properties: {
                "pathname": { type: 'string', title: 'path name of the file' },
                "isdir": { type: 'boolean', title: 'true if pathname is a directory' },
                "isfile": { type: 'boolean', title: 'true if pathname is a file' },
            }
        }
    },
    parameters: {
        'directory': {
            title: 'directory pathname to walk',
            type: 'string',
            default: 'c:/tmp',
            examples: [
                { value: 'c:/tmp', title: 'set parameter directory to a constant' },
                { value: '$\{args.my_param_name}', title: 'use a process parameter to set directory' },
                { value: '$\{globs.my_glob_name}', title: 'use a step global variable to set directory' },
                { value: '$\{args.root}/$\{globs.prefix}_suffix}', title: 'use mixed variables' },
                { value: '$\{pojo.dirname}', title: 'use an inputed pojo property "dirname" from port "files' },
            ]
        },
        'pattern': {
            title: 'full pathname regexp filter',
            type: 'regexp',
            default: '.*',
            examples: [
                { value: '.*', title: 'select all files/directory' },
                { value: '[.](doc\\|pdf)$', title: 'doc and pdf files' },
                { value: '^d:', title: 'only starting with "d:"' },
                { value: '^${args.root}/', title: 'only starting with process argument "root"' },
            ]
        },
        'recursive': {
            title: 'if true do a recursive walk',
            type: 'boolean',
            default: 'false',
        },
        'outdirs': {
            title: 'if true output directories',
            type: 'boolean',
            default: 'true',
        },
        'outfiles': {
            title: 'if true output files',
            type: 'boolean',
            default: 'true',
        }
    }
}


export class DirectoryWalker extends Step {
    static readonly declaration = declaration
    constructor(params: ParamsMap) {
        super(declaration, params)
    }

    async process() {
        const directory = this.params.directory
        const filter = this.params.pattern
        const recursive = this.params.recursive
        const outdirs = this.params.outdirs
        const outfiles = this.params.outfiles
        await walk(directory, recursive, stats => {
            if (!filter.test(stats.pathname)) return Promise.resolve()
            if (stats.isfile && !outfiles) return Promise.resolve()
            if (stats.isdir && !outdirs) return Promise.resolve()
            return this.output('files', { pathname: stats.pathname, isdir: stats.isdir, isfile:stats.isfile })
        })
    }
}

Step.register(DirectoryWalker)
