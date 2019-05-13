/* eslint-disable no-template-curly-in-string */
import * as cef from 'cef-lib/steps/step'
process.env.CEF_PATH = __dirname + '/../..'

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
            gitid: 'mbenzekri/cef-fs/steps/DirectoryWatcher',
            params: {
                directory: '${globals.PATH}',
                created: 'true',
                deleted: 'true',
                pattern: '.*',
            },
        },
        {
            id: 'b',
            gitid: 'mbenzekri/cef-fs/steps/FileLogger',
            params: {
                filename: '${globals.PATH}/cef/filelogger.log',
                append: 'false',
                createdir: 'false',
                message: '${JSON.stringify(pojo)}',
            },
        },
    ],
    pipes: [
        { from: 'a', outport:'files', to: 'b', inport: 'pojos' }
    ]
}

const batch = new cef.Batch(flowchart)

batch.run();