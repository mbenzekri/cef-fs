"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-template-curly-in-string */
const cef = require("cef-lib/step");
const flowchart = {
    name: 'Testing DirectoryWalker ',
    title: 'Testing DirectoryWalker',
    args: {},
    globals: {
        PATH: { value: 'D:/data', type: 'int', desc: 'the data root dir' }
    },
    steps: [
        {
            id: 'a',
            gitid: 'DirectoryWalker@mbenzekri/cef-fs',
            params: {
                path: '${globals.PATH}/geofla',
                recursive: 'true',
                files: '/^(shp)$/i',
            },
        },
        {
            id: 'b',
            gitid: 'FileLogger@mbenzekri/cef-fs',
            params: {
                filename: '${globals.PATH}/cef/filelogger.log',
                append: 'false',
                createdir: 'false',
                message: '${JSON.stringify(feature)}',
            },
        },
    ],
    pipes: []
};
const batch = new cef.Batch(flowchart);
batch.run();
//# sourceMappingURL=test.js.map