import { Declaration, Step, ParamsMap } from 'pojoe/steps'
import { copy } from './tools'

const declaration: Declaration = {
    gitid: 'mbenzekri/pojoe-fs/steps/FileCopier',
    title: 'copy files',
    desc: 'this step copy a source file to destination files',
    inputs: {
        'copy': {
            title: 'pojos from which the source file and the destination file  pathnames will be extracted',
        }
    },
    outputs: {
        'copied': {
            title: 'files copied successfully',
            properties : {
                "source": { type: 'string', title: 'path name of the file to copy' },
                "target": { type: 'string', title: 'target path file name' },
            }
        },
        'failed': {
            title: 'files failed to copy',
            properties : {
                "source": { type: 'string', title: 'path name of the file to copy' },
                "target": { type: 'string', title: 'target path file name' },
                "reason": { type: 'string', title: 'reason of the failure' },
            }
        }
    },
    parameters: {
        'source': {
            title: 'file pathname to copy',
            type: 'string',
            default: '/tmp/temp1.txt',
        },
        'target': {
            title: 'file pathname to copy',
            type: 'string',
            default: '/tmp/temp2.txt',
        },
        'exclusive': {
            title: 'true to ignore existing targets',
            type: 'boolean',
            default: 'false',
        },
    }
}


export class FileCopier extends Step {
    static readonly declaration = declaration
    constructor(params: ParamsMap) {
        super(declaration, params)
    }

    async copy() {
        const source: string = this.params.source
        const target: string = this.params.target
        const exclusive: boolean = this.params.exclusive
        try {
            await copy(source,target,exclusive)
            await this.output('copied', { source, target })
        } catch (err) {
            await this.output('failed', { source, target, reason: err.message })
        }
    }
    async input(inport: string, pojo: any) {
        await this.copy()
    }
    async process() {
        if (this.inport('copy').isconnected) return
        await this.copy()
    }
}

Step.register(FileCopier)
