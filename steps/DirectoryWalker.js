"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cef = require("cef-lib/step");
const path = require("path");
const fs = require("fs");
exports.declaration = {
    gitid: 'mbenzekri/cef-fs/steps/DirectoryWalker',
    title: 'Directory recursive parser',
    desc: 'Provide files from dir or subdir through a recursive walk',
    inputs: {},
    outputs: {
        'files': {
            desc: 'output found filenames'
        }
    },
    parameters: {
        'directory': {
            desc: 'directory to walk',
            type: 'string',
        },
        'pattern': {
            desc: 'regexp for file filtering by full pathname',
            type: 'regexp',
        },
        'extension': {
            desc: 'regexp for file filtering by extension',
            type: 'regexp',
        }
    },
    fields: [
        {
            key: 'directory',
            type: 'text',
            defaultValue: '/var/data',
            templateOptions: {
                label: 'Directory to walk',
                required: true,
            }
        },
        {
            key: 'pattern',
            type: 'text',
            defaultValue: '/.*/',
            templateOptions: {
                label: 'file path/name regexp filter',
                required: true,
            }
        },
        {
            key: 'extension',
            type: 'text',
            defaultValue: '/.*/',
            templateOptions: {
                label: 'file extension pattern ',
                required: true,
            }
        },
    ]
};
class DirectoryWalker extends cef.Step {
    constructor(params, batch) {
        super(exports.declaration, params);
    }
    /**
     * walk recursively a directory and output files mattching pattern and in extension list
     * @param {string} dir : the directory to walk
     * @param {RegExp} pattern : the pattern filter
     * @param {RegExp} extension : the extension list filter
     */
    walk(dir, re_file, re_ext) {
        fs.readdirSync(dir).forEach(f => {
            let dirPath = path.join(dir, f);
            if (fs.statSync(dirPath).isDirectory()) {
                this.walk(dirPath, re_file, re_ext);
            }
            else {
                const filename = path.join(dir, f);
                const extension = path.extname(filename).replace(/^\./, '');
                if (re_file.test(filename) && re_ext.test(extension)) {
                    this.output('files', { filename });
                }
            }
        });
    }
    start() {
        const directory = this.params['directory'];
        const pattern = this.params['pattern'];
        const extension = this.params['extension'];
        this.open('files');
        this.walk(directory, pattern, extension);
        this.close('files');
    }
    end() {
    }
}
function create(params, batch) { return new DirectoryWalker(params, batch); }
exports.create = create;
;
//# sourceMappingURL=DirectoryWalker.js.map