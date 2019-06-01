import { Declaration, Step, ParamsMap } from 'pojoe/steps'
import { rmdir, walk, remove } from './tools'

const declaration: Declaration = {
    gitid: 'mbenzekri/pojoe-fs/steps/DirectoryRemover',
    title: 'remove directories',
    desc: 'this step remove inputed directories',
    inputs: {
        'directories': {
            title: 'pojos from which the directories pathnames will be extracted',
        }
    },
    outputs: {
        'removed': {
            title: 'directory removed successfully',
            properties: {
                "dirname": { type: 'string', title: 'path name of the directory removed' },
            }
        },
        'failed': {
            title: 'directories failed to remove',
            properties: {
                "dirname": { type: 'string', title: 'path name of the directory failed to remove' },
                "reason": { type: 'string', title: 'reason of the failure' },
            }
        }
    },
    parameters: {
        'dirname': {
            title: 'directory pathname to remove',
            type: 'string',
            default: '/tmp/temp.txt',
            examples: [
                { value: 'c:/tmp', title: 'set parameter directory to a constant' },
                { value: '$\{args.my_param_name}', title: 'use a process parameter to set directory' },
                { value: '$\{globs.my_glob_name}', title: 'use a step global variable to set directory' },
                { value: '$\{args.root}/$\{globs.prefix}_suffix}', title: 'use mixed variables' },
                { value: '$\{pojo.dirname}', title: 'use an inputed pojo property "dirname" from port "filesdirs" ' },
            ]
        },
        'pattern': {
            title: 'full pathname regexp filter',
            type: 'regexp',
            default: '/.*/i',
            examples: [
                { value: '/.*/i', title: 'select all files/directory' },
                { value: '/[.](doc\\|pdf)$/i', title: 'doc and pdf files' },
                { value: '/^d:/i', title: 'only starting with "d:"' },
                { value: '/^${args.root}//i', title: 'only starting with process argument "root"' },
            ]
        },
        'recursive': {
            title: 'if true do a recursive remove on directories',
            type: 'boolean',
            default: 'false',
        },
    }
}


export class DirectoryRemover extends Step {
    static readonly declaration = declaration
    constructor(params: ParamsMap) {
        super(declaration, params)
    }

    async remove() {
        const dirname: string = this.params.dirname
        const filter: RegExp = this.params.pattern
        const recursive: boolean = this.params.recursive
        if (!filter.test(dirname)) return
        if (recursive) {
            // remove the dir descendants
            await walk(dirname, recursive, async stats => {
                try {
                    stats.isdir && await rmdir(dirname)
                    stats.isfile && await remove(dirname)
                } catch (err) { }
            })
        }
        // remove the root dir
        try {
            await rmdir(dirname)
            await this.output('removed', { dirname })
        } catch (err) {
            await this.output('failed', { dirname, reason: err.message })
        }
    }

    async input(inport: string, pojo: any) {
        await this.remove()
    }
    async process() {
        if (this.inport('directories').isconnected) return
        await this.remove()
    }
}

Step.register(DirectoryRemover)
