"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-template-curly-in-string */
const cef = require("cef-lib/step");
process.env.CEF_PATH = __dirname;
const flowchart = {
    name: 'Testing DirectoryWatcher ',
    title: 'Testing DirectoryWatcher',
    args: {},
    globals: {
        PATH: { value: 'D:/data', type: 'string', desc: 'the data root dir' }
    },
    steps: [
        {
            id: 'a',
            gitid: './DirectoryWatcher',
            params: {
                directory: '${globals.PATH}',
                pattern: '.*',
                extension: '.*',
            },
        },
        {
            id: 'b',
            gitid: './FileLogger',
            params: {
                filename: '${globals.PATH}/cef/filelogger.log',
                append: 'false',
                createdir: 'false',
                message: '${feature.filename}',
            },
        },
    ],
    pipes: [
        { from: 'a', outport: 'files', to: 'b', inport: 'features' }
    ]
};
const batch = new cef.Batch(flowchart);
batch.run();
//# sourceMappingURL=test.js.map