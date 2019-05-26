import { Step, Declaration, ParamsMap, EOP } from 'pojoe/steps'
import * as path from 'path'
import * as fs from 'fs'
import * as readline from 'readline'


const declaration: Declaration = {
    gitid: 'mbenzekri/pojoe-fs/steps/TextFileReader',
    title: 'reads data from a file',
    desc: 'this step read  a file line by line and output a pojo for each line',
    features: [
        "allow construct a pojo from line parsing",
        "allow input regexp splitting",
        "allow header skiping",
    ],
    inputs: {
        'files': {
            title: 'files produced',
            properties: {
                filename: { type: 'path', title: 'created filename' }
            }
        }
    },
    outputs: {
        'pojos': {
            title: 'pojos which data need to be written'
        }
    },
    parameters: {
        'filename': {
            title: 'text file pathname',
            type: 'string',
            default: '/tmp/myfile.txt'
        },
        'encoding': {
            title: 'encoding of the files to read',
            type: 'string',
            default: 'utf-8',
            enum: { 'ascii': 'ascii', 'ucs2': 'ucs2', 'ucs-2': 'ucs-2', 'utf16le': 'utf16le', 'utf-16le': 'utf-16le', 'utf8': 'utf8', 'utf-8': 'utf-8', 'latin1': 'latin1' }
        },
        'skip': {
            title: 'number of line to skip',
            type: 'int',
            default: '1'
        },
        'splitter': {
            title: 'regexp grouping pattern to split the line',
            type: 'regexp',
            default: '/^(.*)$/i',
        },
        'pojo': {
            title: 'the json pojo to output',
            type: 'json',
            default: '{ "line" : "${this.match[1]}" }',
        },
    },
}

class TextFileReader extends Step {
    static readonly declaration = declaration
    private count = 0 
    constructor(params: ParamsMap) {
        super(declaration, params)
        this.locals.match = []
    }

    async read() {
        const filename = this.params.filename
        const re = this.params.splitter
        const skip = this.params.skip
        const encoding = this.params.encoding

        const options = { flags: 'r', encoding: encoding }
        let fileStream: fs.ReadStream
        let resolve: (value?: void | PromiseLike<void>) => void
        let reject: (reason?: any) => void

        const promise = new Promise<void>((res, rej) => {
            resolve = res
            reject = rej
        })

        try { fileStream = fs.createReadStream(filename, options) }
        catch (e) { this.error(`unable to open file to read ${filename} due to => ${e.message}`) }
        fileStream.on('error', err => {
            fileStream.close();
            reject && reject(new Error(`error when reading file  ${filename} due to => ${err.message}`))
        });
        fileStream.on('end', err => {
            fileStream.close()
            resolve && resolve()
        });

        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        rl.on('line', (line) => {
            this.count++
            if (this.count > skip) {
                this.locals.match = (<RegExp>re).exec(line)
                this.output('pojos', this.params.pojo)
            }
        });

        return promise
    }
    async input(inport: string, pojo: any) {
        await this.read()
    }

    async process() {
        // if data was inputed from 'files' (this.count > 0)
        // all is done during input() nothing to be done
        if (this.count ==  0) await this.read()
    }
}

Step.register(TextFileReader)
