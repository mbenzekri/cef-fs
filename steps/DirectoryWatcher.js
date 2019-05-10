"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cef = require("cef-lib/step");
const fs = require("fs");
exports.declaration = {
    gitid: 'mbenzekri/cef-fs/steps/DirectoryWatcher',
    title: 'Directory change watcher step',
    desc: 'emit a feature for each directory change',
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
        },
        'created': {
            desc: 'if true output created files',
            type: 'boolean',
        },
        'deleted': {
            desc: 'if true output deleted files ',
            type: 'boolean',
        },
        'pattern': {
            desc: 'base filename.ext pattern filter',
            type: 'regexp',
        },
    },
    fields: [
        {
            key: 'directory',
            type: 'text',
            defaultValue: '/var/data',
            templateOptions: {
                label: 'directory to watch',
                required: true,
            }
        },
        {
            key: 'created',
            type: 'text',
            defaultValue: true,
            templateOptions: {
                label: 'created files ?',
                required: true,
            }
        },
        {
            key: 'deleted',
            type: 'text',
            defaultValue: true,
            templateOptions: {
                label: 'deleted files',
                required: true,
            }
        },
        {
            key: 'pattern',
            type: 'text',
            defaultValue: '.*',
            templateOptions: {
                label: 'pattern filter',
                required: true,
            }
        },
    ]
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
    start() {
        this.open('files');
        const directory = this.params.directory;
        fs.watch(directory, (event, who) => {
            if (event === 'rename') {
                const filename = `${directory}/${who}`;
                const change = fs.existsSync(filename) ? 'create' : 'delete';
                const feature = { filename, change };
                this.output("files", feature);
            }
        });
        this.close('files');
    }
    end() {
    }
}
function create(params) { return new DirectoryWatcher(params); }
exports.create = create;
;
//# sourceMappingURL=DirectoryWatcher.js.map