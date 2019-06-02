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
    gitid: 'mbenzekri/pojoe-fs/steps/FileRenamer',
    title: 'rename files',
    desc: 'this step rename a source file to target files',
    inputs: {
        'rename': {
            title: 'pojos from which the source file and the target file pathnames will be extracted',
        }
    },
    outputs: {
        'renamed': {
            title: 'files renamed successfully',
            properties: {
                "source": { type: 'string', title: 'path name of the file to rename' },
                "target": { type: 'string', title: 'target path file name' },
            }
        },
        'failed': {
            title: 'files failed to rename',
            properties: {
                "source": { type: 'string', title: 'path name of the file to rename' },
                "target": { type: 'string', title: 'target path file name' },
                "reason": { type: 'string', title: 'reason of the failure' },
            }
        }
    },
    parameters: {
        'source': {
            title: 'file pathname to rename',
            type: 'string',
            default: '/tmp/temp1.txt',
        },
        'target': {
            title: 'target file pathname',
            type: 'string',
            default: '/tmp/temp2.txt',
        },
        'exclusive': {
            title: 'false to ignore existing targets',
            type: 'boolean',
            default: 'true',
        },
    }
};
class FileRenamer extends steps_1.Step {
    constructor(params) {
        super(declaration, params);
    }
    rename() {
        return __awaiter(this, void 0, void 0, function* () {
            const source = this.params.source;
            const target = this.params.target;
            const exclusive = this.params.exclusive;
            try {
                yield tools_1.rename(source, target, exclusive);
                yield this.output('renamed', { source, target });
            }
            catch (err) {
                yield this.output('failed', { source, target, reason: err.message });
            }
        });
    }
    input(inport, pojo) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.rename();
        });
    }
    process() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.inport('rename').isconnected)
                return;
            yield this.rename();
        });
    }
}
FileRenamer.declaration = declaration;
exports.FileRenamer = FileRenamer;
steps_1.Step.register(FileRenamer);
//# sourceMappingURL=FileRenamer.js.map