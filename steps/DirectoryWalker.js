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
const cef = require("cef-lib");
const path = require("path");
const fs = require("fs");
exports.declaration = {
    gitid: 'mbenzekri/cef-fs/steps/DirectoryWalker',
    title: 'Directory tree recursive walk and output',
    desc: 'This step does a tree recursive walk and outputs every directories or files found',
    features: [
        "allow directory tree walking ",
        "allow recursive or flat walk",
        "allow type file/directory filter",
        "allow regexp filtering for full pathname directories/files",
    ],
    inputs: {},
    outputs: {
        'files': {
            desc: 'output found filenames'
        }
    },
    parameters: {
        'directory': {
            desc: 'directory pathname to walk',
            type: 'string',
            default: 'c:/tmp',
            examples: [
                { value: 'c:/tmp', desc: 'set parameter directory to a constant' },
                { value: '$\{args.my_param_name}', desc: 'use a process parameter to set directory' },
                { value: '$\{globs.my_glob_name}', desc: 'use a step global variable to set directory' },
                { value: '$\{args.root}/$\{globs.prefix}_suffix}', desc: 'use mixed variables' },
                { value: '$\{pojo.dirname}', desc: 'use an inputed pojo property "dirname" from port "files' },
            ]
        },
        'pattern': {
            desc: 'full pathname regexp filter',
            type: 'regexp',
            default: '.*',
            examples: [
                { value: '.*', desc: 'select all files/directory' },
                { value: '[.](doc|pdf)$', desc: 'doc and pdf files' },
                { value: '^d:', desc: 'only starting with "d:"' },
                { value: '^${args.root}/', desc: 'only starting with process argument "root"' },
            ]
        },
        'recursive': {
            desc: 'if true do a recursive walk',
            type: 'boolean',
            default: 'false',
        },
        'outdirs': {
            desc: 'if true output directories',
            type: 'boolean',
            default: 'true',
        },
        'outfiles': {
            desc: 'if true output filtes',
            type: 'boolean',
            default: 'true',
        }
    }
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
    walk(dir, filter, recursive, outdirs, outfiles) {
        return __awaiter(this, void 0, void 0, function* () {
            const dirs = fs.readdirSync(dir);
            for (let item in dirs) {
                let pathname = path.join(dir, item);
                if (fs.statSync(pathname).isDirectory()) {
                    if (recursive)
                        this.walk(pathname, filter, recursive, outdirs, outfiles);
                }
                else {
                    const pathname = path.join(dir, item);
                    if (filter.test(pathname)) {
                        yield this.output('files', { pathname });
                    }
                }
            }
        });
    }
    doit() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const directory = this.params['directory'];
                const filter = this.params['pattern'];
                const recursive = this.params['recursive'];
                const outdirs = this.params['outdirs'];
                const outfiles = this.params['outfiles'];
                this.walk(directory, filter, recursive, outdirs, outfiles);
            });
        });
    }
}
function create(params, batch) { return new DirectoryWalker(params, batch); }
exports.create = create;
;
//# sourceMappingURL=DirectoryWalker.js.map