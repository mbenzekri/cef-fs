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
    gitid: 'mbenzekri/pojoe-fs/steps/FileCopier',
    title: 'copy files',
    desc: 'this step copy a source file to destination files',
    inputs: {
        'copy': {
            title: 'pojos from which the source file and the destination file  pathnames will be extracted',
        }
    },
    outputs: {
        'copied': {
            title: 'files to copied successfully',
            properties: {
                "source": { type: 'string', title: 'path name of the file to copy' },
                "target": { type: 'string', title: 'target path file name' },
            }
        },
        'failed': {
            title: 'files failed to copy',
            properties: {
                "source": { type: 'string', title: 'path name of the file to copy' },
                "target": { type: 'string', title: 'target path file name' },
                "reason": { type: 'string', title: 'reason of the failure' },
            }
        }
    },
    parameters: {
        'source': {
            title: 'file pathname to copy',
            type: 'string',
            default: '/tmp/temp1.txt',
        },
        'target': {
            title: 'file pathname to copy',
            type: 'string',
            default: '/tmp/temp2.txt',
        },
        'exclusive': {
            title: 'true to ignore existing targets',
            type: 'string',
            default: '/tmp/temp2.txt',
        },
    }
};
class FileCopier extends steps_1.Step {
    constructor(params) {
        super(declaration, params);
    }
    copy() {
        return __awaiter(this, void 0, void 0, function* () {
            const source = this.params.source;
            const target = this.params.target;
            const exclusive = this.params.exclusive;
            try {
                yield tools_1.copy(source, target, exclusive);
                yield this.output('copied', { source, target });
            }
            catch (err) {
                yield this.output('failed', { source, target, reason: err.message });
            }
        });
    }
    input(inport, pojo) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.copy();
        });
    }
    process() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.inport('copy').isconnected)
                return;
            yield this.copy();
        });
    }
}
FileCopier.declaration = declaration;
exports.FileCopier = FileCopier;
steps_1.Step.register(FileCopier);
//# sourceMappingURL=FileCopier.js.map