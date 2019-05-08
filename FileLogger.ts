import * as cef from 'cef-lib/step'
import * as path from 'path'
import * as fs from 'fs'

export const declaration = new cef.Declaration({
    gitid: 'FileLogger@mbenzekri/cef-fs',
    title: 'Feature file logger',
    desc: 'Logs inputed features to a file',
    inputs: {
        'features': {
            desc: 'features to be logged'
        }
    },
    outputs: {
    },
    parameters: {
        'filename': {
            desc: 'the log file name full path and name',
            type: 'string',
        },
        'createdir': {
            desc: 'if true create the absent directories',
            type: 'boolean',
        },
        'append': {
            desc: 'if true and file exists append ',
            type: 'boolean',
        },
        'message': {
            desc: 'the message to be outputed for eache feature',
            type: 'boolean',
        },
    },
    fields: [
        {
            key: 'filename',
            type: 'text',
            defaultValue: '/var/data',
            templateOptions: {
                label: 'Log filename',
                required: true,
            }
        },
        {
            key: 'createdir',
            type: 'text',
            defaultValue: false,
            templateOptions: {
                label: 'create dirs ?',
                required: true,
            }
        },
        {
            key: 'message',
            type: 'text',
            defaultValue: '${JSON.stringify(feature)}',
            templateOptions: {
                label: 'message to log',
                required: true,
            }
        },
    ]
})


class FileLogger extends cef.Step {
    streams: { [key:string]: fs.WriteStream } = {}
    constructor (params: cef.ParamsMap, batch: cef.Batch) {
        super(declaration, params, batch)
    }

    /**
     * walk recursively a directory and output files mattching pattern and in extension list
     * @param {string} dir : the directory to walk
     * @param {RegExp} pattern : the pattern filter
     * @param {RegExp} extensions : the extension list filter 
     */
   
    start() {
    }
    end() {  
        Object.keys(this.streams).forEach(filename => {
            const stream = this.streams[filename] 
            if (stream) stream.close()
        })
    }
    input_features(feature) {
        const filename = this.params.filename
        const append = this.params.append
        const createdir = this.params.createdir
        const message = this.params.message
        if (!(filename in this.streams)) {
            this.streams[filename] = null
            const dir = path.dirname(filename)
            try {
                // create the directory if not existing
                if (createdir && !fs.existsSync(dir)) fs.mkdirSync(dir, {recursive:true})
                try {
                    // create vs append to the file 
                    const flags = append ? 'a' : 'w'
                    this.streams[filename] = fs.createWriteStream(null, flags) 
                } catch(e) {
                    this.log(`${this.decl.name}: unable to open file ${filename} due to => ${e.message}`)
                }
            } catch(e){
                this.log(`${this.decl.name}: unable to create directory  ${dir} due to => ${e.message}`)
            }
        }
        const stream: fs.WriteStream = this.streams[filename]
        try {
            if (stream !== null) stream.write(message,(err) => {})
        } catch(e) {
            this.log(`${this.decl.name}: unable to write to file ${filename} due to => ${e.message}`)
        }
    }
}

export function  create(params: cef.ParamsMap, batch: cef.Batch) : FileLogger  { return new FileLogger(params, batch) };
