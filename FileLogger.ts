import * as cef from 'cef-lib'
import * as path from 'path'
import * as fs from 'fs'

export const declaration: cef.Declaration = {
    gitid: 'mbenzekri/cef-fs/steps/FileLogger',
    title: 'Pojo file logger',
    desc: 'Logs inputed pojos data to a file',
    features: [
        "allow writing data for each pojo inputed",
        "allow creation dir if not present",
        "allow append mode",
    ],
    inputs: {
        'pojos': {
            desc: 'pojos to be logged'
        }
    },
    outputs: {
        'files': {
            desc: 'files produced',
            /*
            properties: [
                {}
            ]*/
        }
    },
    parameters: {
        'filename': {
            desc: 'the log file name full path and name',
            type: 'string',
            default: 'c:\tmp\mylogfile.log'
        },
        'createdir': {
            desc: 'if true create the absent directories',
            type: 'boolean',
            default: 'true',
        },
        'append': {
            desc: 'if true and file exists append ',
            type: 'boolean',
            default: 'true',
        },
        'message': {
            desc: 'the message to be outputed for each pojo',
            type: 'string',
            default: '${JSON.stringify(pojo)}',
        },
        'header': {
            desc: 'text to log into the file before pojo outputing',
            type: 'string',
            default: null
        },
        'footer': {
            desc: 'text to log into the file after all pojos outputed',
            type: 'string',
            default: null
        },
    }
}

class FileLogger extends cef.Step {
    streams: { [key:string]: fs.WriteStream } = {}
    constructor (params: cef.ParamsMap) {
        super(declaration, params)
    }

    /**
     * walk recursively a directory and output files mattching pattern and in extension list
     * @param {string} dir : the directory to walk
     * @param {RegExp} pattern : the pattern filter
     * @param {RegExp} extensions : the extension list filter 
     */
   
    async end() {  
        Object.keys(this.streams).forEach(filename => {
            const stream = this.streams[filename] 
            if (stream) stream.close()
        })
    }
    async doit() {
        let pojo = await this.input('pojos') 
        while (pojo !== cef.EOF) {
            const filename = this.params.filename
            const message = this.params.message
            const stream = this.getstream(filename)
            if (stream !== null) {
                stream.write(message,(err) => {
                    err && this.log(`${this.decl.gitid}: unable to write to file ${filename} due to => ${err.message}`)
                })
                stream.write('\n',(err) => {
                    err && this.log(`${this.decl.gitid}: unable to write to file ${filename} due to => ${err.message}`)
                })
            }
            pojo = await this.input('pojos') 
        }
    }
    /**
     * manage a pool of streams for multiple opened files for output
     * @param filename filename to get writestrem
     */
    getstream(filename: string) {
        if (filename in this.streams) return this.streams[filename];
        const append = this.params.append
        const createdir = this.params.createdir
        const flags = append ? 'a' : 'w'
        const dir = path.dirname(filename)
        try {
            // create the directory if not existing
            if (createdir && !fs.existsSync(dir)) fs.mkdirSync(dir, {recursive:true})
        } catch(e){
            this.log(`${this.decl.gitid}: unable to create directory  ${dir} due to => ${e.message}`)
            this.streams[filename] = null;
            return null;
        }
        // create vs append to the file 
        const stream = fs.createWriteStream(filename, {flags, encoding:'utf8'}) 
        stream.on('error', err => {
            this.log(`${this.decl.gitid}: unable to open file ${filename} due to => ${err.message}`)
            stream.end();
            this.streams[filename] = null
        });
        this.streams[filename] = stream
        return stream
    }
}

export function  create(params: cef.ParamsMap) : FileLogger  { return new FileLogger(params) };
