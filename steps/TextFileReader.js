"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const steps_1 = require("pojoe/steps");
const fs = require("fs");
const readline = require("readline");
const declaration = {
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
        'match': { type: 'any[]', title: 'math produced by params.splitter parsing for each text line' }
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
};
class LineFileReader {
    constructor(filename, encoding) {
        this._eof = false;
        this._fifo = [];
        const options = { flags: 'r', encoding: encoding };
        try {
            this._fileStream = fs.createReadStream(filename, options);
        }
        catch (e) {
            this._error = e;
        }
        this._rl = readline.createInterface({
            input: this._fileStream,
            crlfDelay: Infinity
        });
        this._rl.on('line', (newline) => {
            this._rl.pause();
            this._fifo.push(newline);
            if (this._resolve) {
                const line = this._fifo.shift();
                this._resolve(line);
                this._resolve = null;
                this._reject = null;
            }
        });
        this._rl.on('close', () => {
            this._eof = true;
        });
        this._rl.on('error', err => {
            // error may occur during a non pending Promise
            this._fileStream.close();
            this._error = err;
            if (this._reject) {
                this._reject(this._error);
                this._resolve = null;
                this._reject = null;
            }
        });
    }
    get eol() { return this._eof && this._fifo.length === 0; }
    next() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._error)
                return Promise.reject(this._error);
            if (this.eol)
                return Promise.reject(new Error('calling next after EOL (End Of Lines) !'));
            return new Promise((resolve, reject) => {
                if (this._fifo.length) {
                    const line = this._fifo.shift();
                    resolve(line);
                }
                else {
                    this._resolve = resolve;
                    this._reject = reject;
                    this._rl.resume();
                }
            });
        });
    }
}
class TextFileReader extends steps_1.Step {
    constructor(params) {
        super(declaration, params);
        this.locals.match = [];
    }
    /**
     * either with a pojo input or without pojo input
     *  - construct a file name through params.filename,
     *  - parse with params.splitter ans set this.match local var
     *  - and output resulted pojos contructed by params.pojo
     */
    read() {
        return __awaiter(this, void 0, void 0, function* () {
            let count = 0;
            const filename = this.params.filename;
            const re = this.params.splitter;
            const skip = this.params.skip;
            const encoding = this.params.encoding;
            const lfreader = new LineFileReader(filename, encoding);
            while (!lfreader.eol) {
                const line = yield lfreader.next();
                count++;
                if (count > skip) {
                    this.locals.match = re.exec(line);
                    yield this.output('pojos', this.params.pojo);
                }
            }
        });
    }
    /**
     * process inputed file names from port "files"
     * @param inport only "files" input port
     * @param pojo pojo files (params.filename usualy constructed with this data)
     */
    input(inport, pojo) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.read();
        });
    }
    /**
     * if port "files" not connected get a unique filename from params.filename
     */
    process() {
        return __awaiter(this, void 0, void 0, function* () {
            // if port 'files is not connect 
            // get only one file name from params.filename and read the file
            !this.inconnected('files') && (yield this.read());
        });
    }
}
TextFileReader.declaration = declaration;
steps_1.Step.register(TextFileReader);
//# sourceMappingURL=TextFileReader.js.map