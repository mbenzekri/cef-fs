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
const path = require("path");
const fs = require("fs");
const declaration = {
    gitid: 'mbenzekri/pojoe-fs/steps/TextFileReader',
    title: 'reads data from a file',
    desc: 'this step read  a file line by line and output a pojo for each line',
    features: [
        "allow construct a pojo from line parsing",
        "allow input regexp splitting",
        "allow header skiping",
    ],
    parameters: {
        'filename': {
            title: 'text file pathname',
            type: 'path',
            default: 'c:/tmp/myfile.txt'
        },
        'skip': {
            title: 'number of line to skip',
            type: 'int',
            default: '0'
        },
        'pattern': {
            title: 'regexp grouping pattern to split the line',
            type: 'regexp',
            default: 'true',
        },
        'pojo ': {
            title: 'the json pojo to output',
            type: 'json',
            default: 'true',
        },
    },
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
};
class TextFileReader extends steps_1.Step {
    constructor(params) {
        super(declaration, params);
        this.streams = {};
    }
    /**
     * walk recursively a directory and output files mattching pattern and in extension list
     * @param {string} dir : the directory to walk
     * @param {RegExp} pattern : the pattern filter
     * @param {RegExp} extensions : the extension list filter
     */
    end() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let filename of Object.keys(this.streams)) {
                yield this.output('files', { filename });
            }
            Object.keys(this.streams).forEach(filename => {
                const stream = this.streams[filename];
                stream.write(this.params.footer, err => {
                    err && this.error(`unable to write to file ${filename} due to => ${err.message}`);
                    if (stream)
                        stream.end();
                });
            });
        });
    }
    input(inport, pojo) {
        return __awaiter(this, void 0, void 0, function* () {
            const filename = this.params.filename;
            const textline = this.params.textline;
            const stream = this.getstream(filename);
            stream && stream.write(`${textline}\n`, err => {
                err && this.error(`unable to write to file ${filename} due to => ${err.message}`);
            });
        });
    }
    /**
     * manage a pool of streams for multiple opened files for output
     * @param filename filename to get writestrem
     */
    getstream(filename) {
        if (filename in this.streams)
            return this.streams[filename];
        const append = this.params.append;
        const createdir = this.params.createdir;
        const flags = append ? 'a' : 'w';
        const dir = path.dirname(filename);
        try {
            // create the directory if not existing
            if (createdir && !fs.existsSync(dir))
                fs.mkdirSync(dir, { recursive: true });
        }
        catch (e) {
            this.streams[filename] = null;
            this.error(`unable to create directory  ${dir} due to => ${e.message}`);
        }
        // create vs append to the file 
        const stream = fs.createWriteStream(filename, { flags, encoding: 'utf8' });
        stream.on('error', err => {
            stream.end();
            this.streams[filename] = null;
            this.error(`unable to open file ${filename} due to => ${err.message}`);
        });
        stream.write(this.params.header, err => {
            err && this.error(`unable to write to file ${filename} due to => ${err.message}`);
        });
        this.streams[filename] = stream;
        return stream;
    }
}
TextFileReader.declaration = declaration;
steps_1.Step.register(TextFileReader);
//# sourceMappingURL=TextFileReader.1.js.map