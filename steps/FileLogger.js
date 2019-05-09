"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cef = require("cef-lib/step");
const path = require("path");
const fs = require("fs");
exports.declaration = {
    gitid: 'FileLogger@mbenzekri/cef-fs',
    title: 'Feature file logger',
    desc: 'Logs inputed features to a file',
    inputs: {
        'features': {
            desc: 'features to be logged'
        }
    },
    outputs: {},
    parameters: {
        'filename': {
            desc: 'the log file name full path and name',
            type: 'string',
        },
        'createdir': {
            desc: 'if true create the absent directories',
            type: 'true',
        },
        'append': {
            desc: 'if true and file exists append ',
            type: 'boolean',
        },
        'message': {
            desc: 'the message to be outputed for eache feature',
            type: 'string',
        },
    },
    fields: [
        {
            key: 'filename',
            type: 'text',
            defaultValue: '/var/data',
            templateOptions: {
                label: 'Log filename',
                required: true,
            }
        },
        {
            key: 'createdir',
            type: 'text',
            defaultValue: false,
            templateOptions: {
                label: 'create dirs ?',
                required: true,
            }
        },
        {
            key: 'message',
            type: 'text',
            defaultValue: '${JSON.stringify(feature)}',
            templateOptions: {
                label: 'message to log',
                required: true,
            }
        },
    ]
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
    start() {
    }
    end() {
        Object.keys(this.streams).forEach(filename => {
            const stream = this.streams[filename];
            if (stream)
                stream.close();
        });
    }
    input_features() {
        const filename = this.params.filename;
        const message = this.params.message;
        const stream = this.getstream(filename);
        if (stream !== null) {
            stream.write(message, (err) => {
                err && this.log(`${this.decl.gitid}: unable to write to file ${filename} due to => ${err.message}`);
            });
            stream.write('\n', (err) => {
                err && this.log(`${this.decl.gitid}: unable to write to file ${filename} due to => ${err.message}`);
            });
        }
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
            this.log(`${this.decl.gitid}: unable to create directory  ${dir} due to => ${e.message}`);
            this.streams[filename] = null;
            return null;
        }
        // create vs append to the file 
        const stream = fs.createWriteStream(filename, { flags, encoding: 'utf8' });
        stream.on('error', err => {
            this.log(`${this.decl.gitid}: unable to open file ${filename} due to => ${err.message}`);
            stream.end();
            this.streams[filename] = null;
        });
        this.streams[filename] = stream;
        return stream;
    }
}
function create(params) { return new FileLogger(params); }
exports.create = create;
;
//# sourceMappingURL=FileLogger.js.map