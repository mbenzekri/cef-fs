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
const cef = require("pojoe");
const path = require("path");
const fs = require("fs");
exports.declaration = {
    gitid: 'mbenzekri/pojoe-fs/steps/FileLogger',
    title: 'logs inputed pojos to a file',
    desc: 'this step writes user formated data in a text file for each inputed pojo',
    features: [
        "allow writing some data for each pojo inputed",
        "allow full directory path creation if missing",
        "allow file create or append mode",
        "allow header and footer output",
    ],
    parameters: {
        'filename': {
            title: 'the log file name full path and name',
            type: 'string',
            default: 'c:/tmp/mylogfile.log'
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
            title: 'the text to be outputed on file for each pojo',
            type: 'string',
            default: '${JSON.stringify(pojo)}',
        },
        'header': {
            title: 'text to log into the file before pojo outputing',
            type: 'string',
            default: null
        },
        'footer': {
            title: 'text to log into the file after all pojos outputed',
            type: 'string',
            default: null
        },
    },
    inputs: {
        'pojos': {
            title: 'pojos to be logged'
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
};
class FileLogger extends cef.Step {
    constructor(params) {
        super(exports.declaration, params);
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
            for (let filename in Object.keys(this.streams)) {
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
    doit() {
        return __awaiter(this, void 0, void 0, function* () {
            let pojo = yield this.input('pojos');
            while (pojo !== cef.EOP) {
                const filename = this.params.filename;
                const textline = this.params.textline;
                const stream = this.getstream(filename);
                if (stream !== null) {
                    stream.write(`${textline}\n`, err => {
                        err && this.error(`unable to write to file ${filename} due to => ${err.message}`);
                    });
                }
                pojo = yield this.input('pojos');
            }
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
            if (createdir && !existsSync(dir))
                fs.mkdirSync(dir, { recursive: true });
        }
        catch (e) {
            this.streams[filename] = null;
            this.error(`${this.decl.gitid}: unable to create directory  ${dir} due to => ${e.message}`);
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
function create(params) { return new FileLogger(params); }
exports.create = create;
;
//# sourceMappingURL=FileLogger.js.map