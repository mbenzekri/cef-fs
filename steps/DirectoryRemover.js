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
const tools_1 = require("./tools");
const declaration = {
    gitid: 'mbenzekri/pojoe-fs/steps/DirectoryRemover',
    title: 'remove directories',
    desc: 'this step remove inputed directories',
    inputs: {
        'directories': {
            title: 'pojos from which the directories pathnames will be extracted',
        }
    },
    outputs: {
        'removed': {
            title: 'directory removed successfully',
            properties: {
                "dirname": { type: 'string', title: 'path name of the directory removed' },
            }
        },
        'failed': {
            title: 'directories failed to remove',
            properties: {
                "dirname": { type: 'string', title: 'path name of the directory failed to remove' },
                "reason": { type: 'string', title: 'reason of the failure' },
            }
        }
    },
    parameters: {
        'dirname': {
            title: 'directory pathname to remove',
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
class DirectoryRemover extends steps_1.Step {
    constructor(params) {
        super(declaration, params);
    }
    remove() {
        return __awaiter(this, void 0, void 0, function* () {
            const dirname = this.params.dirname;
            const filter = this.params.pattern;
            const recursive = this.params.recursive;
            if (!filter.test(dirname))
                return;
            if (recursive) {
                // remove the dir descendants
                yield tools_1.walk(dirname, recursive, (stats) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        stats.isdir && (yield tools_1.rmdir(dirname));
                        stats.isfile && (yield tools_1.remove(dirname));
                    }
                    catch (err) { }
                }));
            }
            // remove the root dir
            try {
                yield tools_1.rmdir(dirname);
                yield this.output('removed', { dirname });
            }
            catch (err) {
                yield this.output('failed', { dirname, reason: err.message });
            }
        });
    }
    input(inport, pojo) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.remove();
        });
    }
    process() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.inport('directories').isconnected)
                return;
            yield this.remove();
        });
    }
}
DirectoryRemover.declaration = declaration;
exports.DirectoryRemover = DirectoryRemover;
steps_1.Step.register(DirectoryRemover);
//# sourceMappingURL=DirectoryRemover.js.map