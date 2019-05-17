import * as cef from 'cef-lib'
import * as path from 'path'
import * as fs from 'fs'

export const declaration: cef.Declaration = {
    gitid: 'mbenzekri/cef-fs/steps/TextFileWriter',
    title: 'write data from pojos to a file',
    desc: 'this step writes user formated data in a text file for each inputed pojo',
    features: [
        "allow writing some data for each pojo inputed",
        "allow full directory path creation if missing",
        "allow file create or append mode",
        "allow header and footer output",
    ],
    parameters: {
        'filename': {
            title: 'the path and file name to write',
            type: 'string',
            default: 'c:/tmp/myfile.log'
        },
        'createdir': {
            title: 'if true create the missing directories',
            type: 'boolean',
            default: 'true',
        },
        'append': {
            title: 'if true and file exists append ',
            type: 'boolean',
            default: 'true',
        },
        'textline': {
            title: 'the text to be written on the file for each pojo',
            type: 'string',
            default: '${JSON.stringify(pojo)}',
        },
        'header': {
            title: 'text to write into the file before pojo outputing',
            type: 'string',
            default: null
        },
        'footer': {
            title: 'text to write into the file after all pojos outputed',
            type: 'string',
            default: null
        },
    },
    inputs: {
        'pojos': {
            title: 'pojos which data need to be written'
        }
    },
    outputs: {
        'files': {
            title: 'files produced',
            properties: {
                filename: { type:'string', title: 'created filename'}
            }
        }
    },
}

class TextFileWriter extends cef.Step {
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
        for (let filename in Object.keys(this.streams)) {
            await this.output('files',{filename})
        }
        Object.keys(this.streams).forEach(filename => {
            const stream = this.streams[filename] 
            stream.write(this.params.footer,err => {
                err && this.error(`unable to write to file ${filename} due to => ${err.message}`)
                if (stream) stream.end()
            })
    
        })
    }
    async doit() {
        let pojo = await this.input('pojos') 
        while (pojo !== cef.EOF) {
            const filename = this.params.filename
            const textline = this.params.textline
            const stream = this.getstream(filename)
            if (stream !== null) {
                stream.write(`${textline}\n`,err => {
                    err && this.error(`unable to write to file ${filename} due to => ${err.message}`)
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
            this.streams[filename] = null;
            this.error(`unable to create directory  ${dir} due to => ${e.message}`)
        }
        // create vs append to the file 
        const stream = fs.createWriteStream(filename, {flags, encoding:'utf8'}) 
        stream.on('error', err => {
            stream.end();
            this.streams[filename] = null
            this.error(`unable to open file ${filename} due to => ${err.message}`)
        });
        stream.write(this.params.header,err => {
            err && this.error(`unable to write to file ${filename} due to => ${err.message}`)
        })
        this.streams[filename] = stream
        return stream
    }
}

export function  create(params: cef.ParamsMap) : TextFileWriter  { return new TextFileWriter(params) };
