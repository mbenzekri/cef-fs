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
const declaration = {
    gitid: 'mbenzekri/pojoe-fs/steps/FileDirRemover',
    title: 'remove directories or files',
    desc: 'this step remove inputed files or directory',
    features: [
        "allow file search through a directory walking ",
        "allow recursive or flat walk",
        "allow type file/directory filter",
        "allow regexp filtering for full pathname directories and/or files",
    ],
    inputs: {
        'filesdirs': {
            title: 'pojos from which the files/directories pathnames will be constructed',
        }
    },
    outputs: {
        'removed': {
            title: 'files or directories removed successfully',
            properties: {
                "pathname": { type: 'string', title: 'path name of the file or directory removed' },
            }
        },
        'failed': {
            title: 'files or directories removed fail',
            properties: {
                "pathname": { type: 'string', title: 'path name of the file or directory failed to remove' },
                "reason": { type: 'string', title: 'reason of the failure' },
            }
        }
    },
    parameters: {
        'pathname': {
            title: 'directory/file pathname to remove',
            type: 'string',
            default: '/tmp/temp.txt',
            examples: [
                { value: 'c:/tmp', title: 'set parameter directory to a constant' },
                { value: '$\{args.my_param_name}', title: 'use a process parameter to set directory' },
                { value: '$\{globs.my_glob_name}', title: 'use a step global variable to set directory' },
                { value: '$\{args.root}/$\{globs.prefix}_suffix}', title: 'use mixed variables' },
                { value: '$\{pojo.dirname}', title: 'use an inputed pojo property "dirname" from port "filesdirs" ' },
            ]
        },
        'pattern': {
            title: 'full pathname regexp filter',
            type: 'regexp',
            default: '/.*/i',
            examples: [
                { value: '/.*/i', title: 'select all files/directory' },
                { value: '/[.](doc\\|pdf)$/i', title: 'doc and pdf files' },
                { value: '/^d:/i', title: 'only starting with "d:"' },
                { value: '/^${args.root}//i', title: 'only starting with process argument "root"' },
            ]
        },
        'recursive': {
            title: 'if true do a recursive remove on directories',
            type: 'boolean',
            default: 'false',
        },
    }
};
class FileDirRemover extends steps_1.Step {
    constructor(params) {
        super(declaration, params);
    }
    input(inport, pojo) {
        return __awaiter(this, void 0, void 0, function* () {
            const pathname = this.params.pathname;
            const filter = this.params.pattern;
            const recursive = this.params.recursive;
            if (!filter.test(pathname))
                return;
            return new Promise((resolve, reject) => {
                fs.unlink(pathname, err => {
                    if (err)
                        return this.output('files', {});
                });
            });
        });
    }
}
FileDirRemover.declaration = declaration;
exports.FileDirRemover = FileDirRemover;
steps_1.Step.register(FileDirRemover);
//# sourceMappingURL=FileDirRemover.js.map