import { Declaration, Step, ParamsMap } from 'pojoe/steps'
import * as fs from 'fs'
import * as path from 'path'

const declaration: Declaration = {
    gitid: 'mbenzekri/pojoe-fs/steps/DirectoryWatcher',
    title: 'directory change watcher step',
    desc: 'this step emits a pojo for each change in a given directory',
    features: [
        "allow directory change detection",
        "allow regexp filtering for full pathname directories/files",
        "allow change type filtering (create and/or deleted",
    ],
    inputs: {},
    outputs: {
        'files': {
            title: 'changed files or directory',
            properties: {
                "pathname": { type: 'string', title: 'path name of the file or directory' },
                "isdir": { type: 'boolean', title: 'true if pathname is a directory' },
                "isfile": { type: 'boolean', title: 'true if pathname is a file' },
                "change": { type: 'string', title: 'nature of the change "created" or "deleted' },
            }
        }
    },
    parameters: {
        'directory': {
            title: 'the directory to watch for changes',
            type: 'string',
            default: 'c:/tmp',
            examples: [
                { value: 'c:/tmp', title: 'set parameter directory to a constant' },
                { value: '$\{args.my_param_name}', title: 'use a process parameter to set directory' },
                { value: '$\{globs.my_glob_name}', title: 'use a step global variable to set directory' },
                { value: '$\{args.root}/$\{globs.prefix}_suffix}', title: 'use mixed variables' },
            ]
        },
        'pattern': {
            title: 'full pathname regexp filter',
            type: 'regexp',
            default: '.*',
            examples: [
                { value: '[.](doc\\|docx)$', title: 'select only doc and docx changes' },
                { value: '^[^C]:', title: 'avoid "C:" starting paths ' },
                { value: '^[A-Z]:', title: 'must be absolute pathname' },
                { value: '.*${globs.asubstr}.*', title: 'must contain a known substring' },
            ]
        },
        'created': {
            title: 'if true output created files',
            type: 'boolean',
            default: 'true',
        },
        'deleted': {
            title: 'if true output deleted files ',
            type: 'boolean',
            default: 'true',
        },
    }
}

export class DirectoryWatcher extends Step {
    static readonly declaration = declaration
    private streams: { [key: string]: fs.WriteStream } = {}
    private watcher: fs.FSWatcher
    private directory: string
    private resolve: (value?: any) => any
    constructor(params: ParamsMap) {
        super(declaration, params)
    }

    /**
     * walk recursively a directory and output files mattching pattern and in extension list
     * @param {string} dir : the directory to walk
     * @param {RegExp} pattern : the pattern filter
     * @param {RegExp} extensions : the extension list filter 
     */

    async doit() {
        this.directory = this.params.directory
        await new Promise((resolve) => {
            this.resolve = resolve
            this.watcher = fs.watch(this.directory, (event: string, who: any) => {
                try {
                    if (event === 'rename') {
                        const filename = path.join(this.directory, who)
                        let exists = false
                        exists = fs.existsSync(filename)
                        const change = exists ? 'create' : 'delete'
                        let isdir:boolean = false
                        let isfile:boolean = false
                        if (exists) {
                            const stat = fs.statSync(filename)
                            isdir = stat.isDirectory()
                            isfile = stat.isFile()
                        }
                        const pojo = { filename, change, isdir, isfile }
                        if (this.params.pattern.test(filename)) {
                            if (this.params.created && exists)  this.output("files", pojo)
                            if (this.params.deleted && !exists) this.output("files", pojo)
                        }
                    }
                } catch (e) {
                    this.log(`${this}: ERROR during watch due to ${e.message}`)
                }
            })
            this.debug(`Start DirectoryWatcher over directory :${this.directory}`)
        })
    }
    stop() {
        this.debug(`Ending DirectoryWatcher over directory :${this.directory}`)
        this.watcher && this.watcher.close();
        this.resolve && this.resolve();
    }
}

Step.register(DirectoryWatcher)
