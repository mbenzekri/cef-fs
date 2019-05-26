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
};
class TextFileReader extends steps_1.Step {
    constructor(params) {
        super(declaration, params);
        this.count = 0;
        this.locals.match = [];
    }
    read() {
        return __awaiter(this, void 0, void 0, function* () {
            const filename = this.params.filename;
            const re = this.params.splitter;
            const skip = this.params.skip;
            const encoding = this.params.encoding;
            const options = { flags: 'r', encoding: encoding };
            let fileStream;
            let resolve;
            let reject;
            const promise = new Promise((res, rej) => {
                resolve = res;
                reject = rej;
            });
            try {
                fileStream = fs.createReadStream(filename, options);
            }
            catch (e) {
                this.error(`unable to open file to read ${filename} due to => ${e.message}`);
            }
            fileStream.on('error', err => {
                fileStream.close();
                reject && reject(new Error(`error when reading file  ${filename} due to => ${err.message}`));
            });
            fileStream.on('end', err => {
                fileStream.close();
                resolve && resolve();
            });
            const rl = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity
            });
            rl.on('line', (line) => {
                this.count++;
                if (this.count > skip) {
                    this.locals.match = re.exec(line);
                    this.output('pojos', this.params.pojo);
                }
            });
            return promise;
        });
    }
    input(inport, pojo) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.read();
        });
    }
    process() {
        return __awaiter(this, void 0, void 0, function* () {
            // if data was inputed from 'files' (this.count > 0)
            // all is done during input() nothing to be done
            if (this.count == 0)
                yield this.read();
        });
    }
}
TextFileReader.declaration = declaration;
steps_1.Step.register(TextFileReader);
//# sourceMappingURL=TextFileReader.js.map