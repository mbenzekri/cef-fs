import { Step, Declaration, ParamsMap, EOP } from 'pojoe/steps'
import * as fs from 'fs'
import * as readline from 'readline'


const declaration: Declaration = {
    gitid: 'mbenzekri/pojoe-fs/steps/TextFileReader',
    title: 'reads data from a file',
    desc: 'this step read  a file line by line and output a pojo for each line',
    features: [
        "allow  multiple filenames from input or single filename from parameter",
        "allow pojo construction from parsed inputed text line",
        "allow input text line regexp parsing/splitting",
        "allow header lines skiping",
    ],
    locals: { 
        'match': { type: 'any[]', title: 'math produced by params.splitter parsing for each text line'} 
    },
    inputs: {
        'files': {
            title: 'files to read',
        }
    },
    outputs: {
        'pojos': {
            title: 'pojos read from files'
        }
    },
    parameters: {
        'filename': {
            title: 'text file pathname to read',
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
            title: 'regexp grouping pattern to parse the line use local var "match" to get parsed result',
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
    constructor(params: ParamsMap) {
        super(declaration, params)
        this.locals.match = []
    }

    /**
     * either with a pojo input or without pojo input
     *  - construct a file name through params.filename, 
     *  - parse with params.splitter ans set this.match local var
     *  - and output resulted pojos contructed by params.pojo
     */
    async read() {
        let count = 0
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
            count++
            if (count > skip) {
                this.locals.match = (<RegExp>re).exec(line)
                this.output('pojos', this.params.pojo)
            }
        });

        return promise
    }

    /**
     * process inputed file names from port "files"
     * @param inport only "files" input port 
     * @param pojo pojo files (params.filename usualy constructed with this data)
     */
    async input(inport: string, pojo: any) {
        await this.read()
    }

    /**
     * if port "files" not connected get a unique filename from params.filename
     */
    async process() {
        // if port 'files is not connect 
        // get only one file name from params.filename and read the file
        !this.inconnected('files') && await this.read()
    }
}

Step.register(TextFileReader)
