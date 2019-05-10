import * as cef from 'cef-lib/step'
import * as path from 'path'
import * as fs from 'fs'

export const declaration: cef.Declaration = {
    gitid: 'mbenzekri/cef-fs/steps/DirectoryWatcher',
    title: 'Directory change watcher step',
    desc: 'emit a feature for each directory change',
    inputs: {
    },
    outputs: {
        'files': {
            desc: 'changed files'
        }
    },
    parameters: {
        'directory': {
            desc: 'the directory to watch for changes',
            type: 'string',
        },
        'created': {
            desc: 'if true output created files',
            type: 'boolean',
        },
        'deleted': {
            desc: 'if true output deleted files ',
            type: 'boolean',
        },
        'pattern': {
            desc: 'base filename.ext pattern filter',
            type: 'regexp',
        },
    },
    fields: [
        {
            key: 'directory',
            type: 'text',
            defaultValue: '/var/data',
            templateOptions: {
                label: 'directory to watch',
                required: true,
            }
        },
        {
            key: 'created',
            type: 'text',
            defaultValue: true,
            templateOptions: {
                label: 'created files ?',
                required: true,
            }
        },
        {
            key: 'deleted',
            type: 'text',
            defaultValue: true,
            templateOptions: {
                label: 'deleted files',
                required: true,
            }
        },
        {
            key: 'pattern',
            type: 'text',
            defaultValue: '.*',
            templateOptions: {
                label: 'pattern filter',
                required: true,
            }
        },
    ]
}

class DirectoryWatcher extends cef.Step {
    streams: { [key:string]: fs.WriteStream } = {}
    constructor (params: cef.ParamsMap) {
        super(declaration, params)
    }

    /**
     * walk recursively a directory and output files mattching pattern and in extension list
     * @param {string} dir : the directory to walk
     * @param {RegExp} pattern : the pattern filter
     * @param {RegExp} extensions : the extension list filter 
     */
   
    start() {
        this.open('files')
        const directory = this.params.directory
        fs.watch(directory, (event: string, who: any) => {
            if (event === 'rename') {
                const filename = `${directory}/${who}`
                const change = fs.existsSync(filename) ? 'create' :'delete'
                const feature = {filename,change}
                this.output("files", feature) 
            }
        })
        this.close('files')
    }
    end() {
    }
}

export function  create(params: cef.ParamsMap) : DirectoryWatcher  { return new DirectoryWatcher(params) };
