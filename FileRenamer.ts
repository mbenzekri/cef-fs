import { Declaration, Step, ParamsMap } from 'pojoe/steps'
import { rename } from './tools'

const declaration: Declaration = {
    gitid: 'mbenzekri/pojoe-fs/steps/FileRenamer',
    title: 'rename files',
    desc: 'this step rename a source file to target files',
    inputs: {
        'rename': {
            title: 'pojos from which the source file and the target file pathnames will be extracted',
        }
    },
    outputs: {
        'renamed': {
            title: 'files renamed successfully',
            properties : {
                "source": { type: 'string', title: 'path name of the file to rename' },
                "target": { type: 'string', title: 'target path file name' },
            }
        },
        'failed': {
            title: 'files failed to rename',
            properties : {
                "source": { type: 'string', title: 'path name of the file to rename' },
                "target": { type: 'string', title: 'target path file name' },
                "reason": { type: 'string', title: 'reason of the failure' },
            }
        }
    },
    parameters: {
        'source': {
            title: 'file pathname to rename',
            type: 'string',
            default: '/tmp/temp1.txt',
        },
        'target': {
            title: 'target file pathname',
            type: 'string',
            default: '/tmp/temp2.txt',
        },
        'exclusive': {
            title: 'false to ignore existing targets',
            type: 'boolean',
            default: 'true',
        },
    }
}

export class FileRenamer extends Step {
    static readonly declaration = declaration
    constructor(params: ParamsMap) {
        super(declaration, params)
    }

    async rename() {
        const source: string = this.params.source
        const target: string = this.params.target
        const exclusive: boolean = this.params.exclusive
        try {
            await rename(source,target,exclusive)
            await this.output('renamed', { source, target })
        } catch (err) {
            await this.output('failed', { source, target, reason: err.message })
        }
    }
    async input(inport: string, pojo: any) {
        await this.rename()
    }
    async process() {
        if (this.inport('rename').isconnected) return
        await this.rename()
    }
}

Step.register(FileRenamer)
