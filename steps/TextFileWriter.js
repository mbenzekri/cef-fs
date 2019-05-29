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
    gitid: 'mbenzekri/pojoe-fs/steps/TextFileWriter',
    title: 'write data from pojos to a file',
    desc: 'this step writes user formated data in a text file for each inputed pojo',
    features: [
        "allow writing some data for each pojo inputed",
        "allow full directory path creation if missing",
        "allow file create or append mode",
        "allow header and footer output",
    ],
    inputs: {
        'pojos': {
            title: 'pojos which data need to be written'
        }
    },
    outputs: {
        'files': {
            title: 'files produced',
            properties: {
                filename: { type: 'string', title: 'created filename' }
            }
        }
    },
    parameters: {
        'filename': {
            title: 'the path and file name to write',
            type: 'string',
            default: '/tmp/myfile.log'
        },
        'createdir': {
            title: 'if true create the missing directories',
            type: 'boolean',
            default: 'true',
        },
        'append': {
            title: 'if true and file exists append ',
            type: 'boolean',
            default: 'true',
        },
        'textline': {
            title: 'the text to be written on the file for each pojo',
            type: 'string',
            default: '${JSON.stringify(pojo)}',
        },
        'header': {
            title: 'text to write into the file before firt <textline> output',
            type: 'string',
            default: "[\n"
        },
        'separator': {
            title: 'text to separate each outputed <textline>',
            type: 'string',
            default: '\n'
        },
        'footer': {
            title: 'text to write to the file after all outputed <textline> ',
            type: 'string',
            default: "]\n"
        },
    },
};
class TextFileWriter extends steps_1.Step {
    constructor(params) {
        super(declaration, params);
        this.streams = {};
        this._lines = [];
        this._size = 0;
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
    /**
     *
     * @param inport  the output port ( on port "pojos" declared)
     * @param pojo the pojo to wrtie to the text file
     */
    input(inport, pojo) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const filename = this.params.filename;
                const textline = this.params.textline;
                const separator = this.params.separator;
                const stream = this.getstream(filename);
                if (this._size + textline > 100000) {
                    const towrite = this._lines.join('');
                    this._lines = [textline, separator];
                    stream && stream.write(towrite, err => {
                        err && reject(new Error(`unable to write to file ${filename} due to => ${err.message}`));
                        resolve();
                    });
                }
                else {
                    this._lines.push(textline, separator);
                    resolve();
                }
            });
        });
    }
    /**
     * all the mainwrite process is done in input() method
     * process() method only write footers and close the stream pool
     */
    process() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const keys = Object.keys(this.streams);
                let count = 0;
                keys.forEach(filename => {
                    const stream = this.streams[filename];
                    stream.write(this.params.footer, err => {
                        err && reject(new Error(`unable to write to file ${filename} due to => ${err.message}`));
                        if (stream)
                            stream.close();
                        if (++count >= keys.length)
                            resolve();
                    });
                });
            });
        });
    }
    /**
     * output all the filename outputed
     */
    end() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let filename of Object.keys(this.streams)) {
                yield this.output('files', { filename });
            }
        });
    }
}
TextFileWriter.declaration = declaration;
steps_1.Step.register(TextFileWriter);
//# sourceMappingURL=TextFileWriter.js.map