import * as cef from 'cef-lib'
import * as path from 'path'
import * as fs from 'fs'

export const declaration: cef.Declaration = {
    gitid: 'mbenzekri/cef-fs/steps/DirectoryWalker',
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


class DirectoryWalker extends cef.Step {
    constructor(params: cef.ParamsMap, batch: cef.Batch) {
        super(declaration, params)
    }

    /**
     * walk recursively a directory and output files mattching pattern and in extension list
     * @param {string} dir : the directory to walk
     * @param {RegExp} pattern : the pattern filter
     * @param {RegExp} extension : the extension list filter 
     */
    async walk(dir: string, filter: RegExp, recursive: boolean, outdirs: boolean, outfiles: boolean) {
        const dirs = fs.readdirSync(dir)
        for (let item in dirs) {
            const pathname = path.join(dir, item);
            const isdir = fs.statSync(pathname).isDirectory()
            const isfile = fs.statSync(pathname).isFile()
            if (isfile || isdir) {
                if (filter.test(pathname)) {
                    await this.output('files', { pathname, isdir, isfile })
                }
                if (isdir && recursive) this.walk(pathname, filter, recursive, outdirs, outfiles)
            }
        }
    }
    async doit() {
        const directory = this.params['directory']
        const filter = this.params['pattern']
        const recursive = this.params['recursive']
        const outdirs = this.params['outdirs']
        const outfiles = this.params['outfiles']
        return this.walk(directory, filter, recursive, outdirs, outfiles)
    }
}

export function create(params: cef.ParamsMap, batch: cef.Batch): DirectoryWalker { return new DirectoryWalker(params, batch) };
