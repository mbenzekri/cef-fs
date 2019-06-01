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
    gitid: 'mbenzekri/pojoe-fs/steps/FileRemover',
    title: 'remove files',
    desc: 'this step remove inputed files',
    inputs: {
        'files': {
            title: 'pojos from which the files pathnames will be extracted',
        }
    },
    outputs: {
        'removed': {
            title: 'files removed successfully',
            properties: {
                "filename": { type: 'string', title: 'path name of the file removed' },
            }
        },
        'failed': {
            title: 'files failed to remove',
            properties: {
                "filename": { type: 'string', title: 'path name of the file failed to remove' },
                "reason": { type: 'string', title: 'reason of the failure' },
            }
        }
    },
    parameters: {
        'filename': {
            title: 'file pathname to remove',
            type: 'string',
            default: '/tmp/temp.txt',
            examples: [
                { value: 'c:/tmp/temp.txt', title: 'set parameter directory to a constant' },
                { value: '$\{args.my_param_name}', title: 'use a process parameter to set directory' },
                { value: '$\{globs.my_glob_name}', title: 'use a step global variable to set directory' },
                { value: '$\{args.root}/$\{globs.prefix}_suffix}', title: 'use mixed variables' },
                { value: '$\{pojo.dirname}/tmp.txt', title: 'use an inputed pojo property "dirname" from port "filesdirs" ' },
            ]
        },
        'pattern': {
            title: 'full pathname regexp filter',
            type: 'regexp',
            default: '/.*/i',
            examples: [
                { value: '/.*/i', title: 'select all files' },
                { value: '/[.](doc\\|pdf)$/i', title: 'doc and pdf files' },
                { value: '/^d:/i', title: 'only starting with "d:"' },
                { value: '/^${args.root}//i', title: 'only starting with process argument "root"' },
            ]
        }
    }
};
class FileRemover extends steps_1.Step {
    constructor(params) {
        super(declaration, params);
    }
    remove() {
        return __awaiter(this, void 0, void 0, function* () {
            const filename = this.params.filename;
            const filter = this.params.pattern;
            if (!filter.test(filename))
                return;
            try {
                yield tools_1.remove(filename);
                yield this.output('removed', { filename });
            }
            catch (err) {
                yield this.output('failed', { filename, reason: err.message });
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
            if (this.inport('files').isconnected)
                return;
            yield this.remove();
        });
    }
}
FileRemover.declaration = declaration;
exports.FileRemover = FileRemover;
steps_1.Step.register(FileRemover);
//# sourceMappingURL=FileRemover.js.map