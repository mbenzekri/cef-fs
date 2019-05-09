/* eslint-disable no-template-curly-in-string */
import * as cef from 'cef-lib/step'
process.env.CEF_PATH = __dirname

const flowchart: cef.Flowchart = {
    name: 'Testing DirectoryWatcher ',
    title: 'Testing DirectoryWatcher',
    args: {},
    globals: {
        PATH : { value: 'D:/data', type: 'string', desc: 'the data root dir' }
    },
    steps: [
        {
            id: 'a',
            gitid: './DirectoryWatcher@mbenzekri',
            params: {
                directory: '${globals.PATH}',
                pattern: '.*',
                extension: '.*',
            },
        },
        {
            id: 'b',
            gitid: './FileLogger@mbenzekri',
            params: {
                filename: '${globals.PATH}/cef/filelogger.log',
                append: 'false',
                createdir: 'false',
                message: '${feature.filename}',
            },
        },
    ],
    pipes: [
        { from: 'a', outport:'files', to: 'b', inport: 'features' }
    ]
}

const batch = new cef.Batch(flowchart)

batch.run();