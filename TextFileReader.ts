import { Step, Declaration, ParamsMap, EOP } from 'pojoe/steps'
import * as fs from 'fs'
import * as readline from 'readline'
import { resolve } from 'path';


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

class LineFileReader {
    private _eof = false
    private _fileStream: fs.ReadStream
    private _resolve : Function
    private _reject : Function
    private _rl: readline.Interface
    private _fifo: string[] = []
    private _error: any
    constructor(filename:string, encoding:string) {
        const options = { flags: 'r', encoding: encoding }
        try {  
            this._fileStream = fs.createReadStream(filename, options)
        } catch (e) { this._error = e }
        this._rl = readline.createInterface({
            input: this._fileStream,
            crlfDelay: Infinity
        });

        this._rl.on('line', (newline) => {
            this._rl.pause()
            this._fifo.push(newline)
            if (this._resolve) {
                const line = this._fifo.shift()
                this._resolve(line)
                this._resolve = null
                this._reject = null
            }
        });
        this._rl.on('close', () => {
            this._eof = true
        });
        this._rl.on('error', err => {
            // error may occur during a non pending Promise
            this._fileStream.close();
            this._error = err
            if (this._reject) {
                this._reject(this._error)
                this._resolve = null
                this._reject = null
            } 
        });
    }
    get eol() {return this._eof && this._fifo.length === 0 }
    async next(): Promise<string> {
        if (this._error) return Promise.reject(this._error)
        if (this.eol) return Promise.reject(new Error('calling next after EOL (End Of Lines) !'))
        return new Promise<string>((resolve,reject) => {
            if (this._fifo.length) {
                const line = this._fifo.shift()
                resolve(line)
            } else {
                this._resolve = resolve
                this._reject = reject
                this._rl.resume()    
            }
        })
    }
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

        const lfreader = new LineFileReader(filename, encoding)
        while(!lfreader.eol) {
            const line = await lfreader.next()
            count++
            if (count > skip) {
                this.locals.match = (<RegExp>re).exec(line)
                await this.output('pojos', this.params.pojo)
            }
        }
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
