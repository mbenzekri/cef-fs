/* eslint-disable no-template-curly-in-string */
import * as cef from 'cef-lib/step'
process.env.CEF_PATH = __dirname

const flowchart: cef.Flowchart = {
    name: 'Testing DirectoryWalker ',
    title: 'Testing DirectoryWalker',
    args: {},
    globals: {
        PATH : { value: 'D:/data', type: 'string', desc: 'the data root dir' }
    },
    steps: [
        {
            id: 'a',
            gitid: './DirectoryWalker@mbenzekri',
            params: {
                directory: '${globals.PATH}',
                pattern: '.*',
                extension: '^(shp|SHP)$',
            },
        },
        {
            id: 'b',
            gitid: './FileLogger@mbenzekri',
            params: {
                filename: '${globals.PATH}/cef/filelogger.log',
                append: 'false',
                createdir: 'false',
                message: '${JSON.stringify(feature)}',
            },
        },
    ],
    pipes: [
        { from: 'a', outport:'files', to: 'b', inport: 'features' }
    ]
}

const batch = new cef.Batch(flowchart)

batch.run();