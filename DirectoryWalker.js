"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cef = require("cef-lib/step");
const path = require("path");
const fs = require("fs");
const declaration = new cef.Declaration({
    gitid: 'DirectoryWalker@mbenzekri/cef-fs',
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
            type: cef.BaseType.string,
        },
        'pattern': {
            desc: 'file pattern for file filtering',
            type: cef.BaseType.regexp,
        },
        'extensions': {
            desc: 'list of comma separated extensions for file filtering',
            type: cef.BaseType.regexp,
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
                label: 'regexp pattern filter',
                required: true,
            }
        },
        {
            key: 'extensions',
            type: 'text',
            defaultValue: '/.*/',
            templateOptions: {
                label: 'file extension list ',
                required: true,
            }
        },
    ]
});
class DirectoryWalker extends cef.Step {
    constructor(params, batch) {
        super(declaration, params, batch);
    }
    /**
     * walk recursively a directory and output files mattching pattern and in extension list
     * @param {string} dir : the directory to walk
     * @param {RegExp} pattern : the pattern filter
     * @param {RegExp} extensions : the extension list filter
     */
    walk(dir, pattern, extensions) {
        fs.readdirSync(dir).forEach(f => {
            let dirPath = path.join(dir, f);
            if (fs.statSync(dirPath).isDirectory()) {
                this.walk(dirPath, pattern, extensions);
            }
            else {
                const filename = path.join(dir, f);
                const extension = path.extname(filename).replace(/^\./, '');
                if (pattern.test(filename) && extensions.test(extension)) {
                    this.output('files', { filename });
                }
            }
        });
    }
    start() {
        const directory = this.params['directory'];
        const pattern = this.params['pattern'];
        const extensions = this.params['extensions'];
        this.open('files');
        this.walk(directory, pattern, extensions);
        this.close('files');
    }
    end() {
    }
}
function create(params, batch) { return new DirectoryWalker(params, batch); }
exports.create = create;
;
//# sourceMappingURL=DirectoryWalker.js.map