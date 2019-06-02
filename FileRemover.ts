import { Declaration, Step, ParamsMap } from 'pojoe/steps'
import { remove } from './tools';

const declaration: Declaration = {
    gitid: 'mbenzekri/pojoe-fs/steps/FileRemover',
    title: 'remove files',
    desc: 'this step remove inputed files',
    inputs: {
        'files': {
            title: 'pojos from which the files pathnames will be extracted',
        }
    },
    outputs: {
        'removed': {
            title: 'files removed successfully',
            properties : {
                "filename": { type: 'string', title: 'path name of the file removed' },
            }
        },
        'failed': {
            title: 'files failed to remove',
            properties : {
                "filename": { type: 'string', title: 'path name of the file failed to remove' },
                "reason": { type: 'string', title: 'reason of the failure' },
            }
        }
    },
    parameters: {
        'filename': {
            title: 'file pathname to remove',
            type: 'string',
            default: '/tmp/temp.txt',
            examples: [
                { value: 'c:/tmp/temp.txt', title: 'set parameter directory to a constant' },
                { value: '$\{args.my_param_name}', title: 'use a process parameter to set directory' },
                { value: '$\{globs.my_glob_name}', title: 'use a step global variable to set directory' },
                { value: '$\{args.root}/$\{globs.prefix}_suffix}', title: 'use mixed variables' },
                { value: '$\{pojo.dirname}/tmp.txt', title: 'use an inputed pojo property "dirname" from port "filesdirs" ' },
            ]
        },
        'pattern': {
            title: 'full pathname regexp filter',
            type: 'regexp',
            default: '/.*/i',
            examples: [
                { value: '/.*/i', title: 'select all files' },
                { value: '/[.](doc\\|pdf)$/i', title: 'doc and pdf files' },
                { value: '/^d:/i', title: 'only starting with "d:"' },
                { value: '/^${args.root}//i', title: 'only starting with process argument "root"' },
            ]
        }
    }
}


export class FileRemover extends Step {
    static readonly declaration = declaration
    constructor(params: ParamsMap) {
        super(declaration, params)
    }

    async remove() {
        const filename: string = this.params.filename
        const filter: RegExp = this.params.pattern
        if (!filter.test(filename)) return
        try {
            await remove(filename)
            await this.output('removed', { filename })
        } catch (err) {
            await this.output('failed', { filename, reason: err.message })
        }
    }
    async input(inport: string, pojo: any) {
        await this.remove()
    }
    async process() {
        if (this.inport('files').isconnected) return
        await this.remove()
    }
}

module.exports = Step.register(FileRemover)
