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
const fs = require("fs");
exports.declaration = {
    gitid: 'mbenzekri/cef-fs/steps/DirectoryWatcher',
    title: 'Directory change watcher step',
    desc: 'emit a pojo for each directory change',
    features: [
        "allow directory change watching ",
        "allow regexp filtering for full pathname directories/files",
        "allow change type filtering (create and/or deleted",
    ],
    inputs: {},
    outputs: {
        'files': {
            desc: 'changed files'
        }
    },
    parameters: {
        'directory': {
            desc: 'the directory to watch for changes',
            type: 'string',
            default: 'c:/tmp',
            examples: [
                { value: 'c:/tmp', desc: 'set parameter directory to a constant' },
                { value: '$\{args.my_param_name}', desc: 'use a process parameter to set directory' },
                { value: '$\{globs.my_glob_name}', desc: 'use a step global variable to set directory' },
                { value: '$\{args.root}/$\{globs.prefix}_suffix}', desc: 'use mixed variables' },
            ]
        },
        'pattern': {
            desc: 'full pathname regexp filter',
            type: 'regexp',
            default: '.*',
            examples: [
                { value: 'c:/tmp', desc: 'set parameter directory to a constant' },
                { value: '$\{args.my_param_name}', desc: 'use a process parameter to set directory' },
                { value: '$\{globs.my_glob_name}', desc: 'use a step global variable to set directory' },
                { value: '$\{args.root}/$\{globs.prefix}_suffix}', desc: 'use mixed variables' },
            ]
        },
        'created': {
            desc: 'if true output created files',
            type: 'boolean',
            default: 'true',
        },
        'deleted': {
            desc: 'if true output deleted files ',
            type: 'boolean',
            default: 'c:\tmps',
        },
    }
};
class DirectoryWatcher extends cef.Step {
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
    doit() {
        return __awaiter(this, void 0, void 0, function* () {
            const directory = this.params.directory;
            process.on('SIGINT', () => {
                console.log("!!! Caught interrupt signal");
                process.exit();
            });
            return new Promise(() => {
                fs.watch(directory, (event, who) => {
                    if (event === 'rename') {
                        const filename = `${directory}/${who}`;
                        const exists = fs.existsSync(filename);
                        const change = exists ? 'create' : 'delete';
                        const stat = fs.statSync(filename);
                        const isdir = stat.isDirectory;
                        const isfile = stat.isFile;
                        const pojo = { filename, change, isdir, isfile };
                        if (this.params.pattern.test(filename)) {
                            if (this.params.created && exists)
                                this.output("files", pojo);
                            if (this.params.deleted && !exists)
                                this.output("files", pojo);
                        }
                    }
                });
            });
        });
    }
}
function create(params) { return new DirectoryWatcher(params); }
exports.create = create;
;
//# sourceMappingURL=DirectoryWatcher.js.map