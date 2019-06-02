import { Step, Declaration, ParamsMap, EOP } from 'pojoe/steps'
import * as path from 'path'
import * as fs from 'fs'

const declaration: Declaration = {
    gitid: 'mbenzekri/pojoe-fs/steps/TextFileWriter',
    title: 'write data from pojos to a file',
    desc: 'this step writes user formated data in a text file for each inputed pojo',
    features: [
        "allow writing some data for each pojo inputed",
        "allow full directory path creation if missing",
        "allow file create or append mode",
        "allow header and footer output",
    ],
    inputs: {
        'pojos': {
            title: 'pojos which data need to be written'
        }
    },
    outputs: {
        'files': {
            title: 'files produced',
            properties: {
                filename: { type: 'string', title: 'created filename' }
            }
        }
    },
    parameters: {
        'filename': {
            title: 'the path and file name to write',
            type: 'string',
            default: '/tmp/myfile.log'
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
            title: 'text to write into the file before firt <textline> output',
            type: 'string',
            default: "[\n"
        },
        'separator': {
            title: 'text to separate each outputed <textline>',
            type: 'string',
            default: '\n'
        },
        'footer': {
            title: 'text to write to the file after all outputed <textline> ',
            type: 'string',
            default: "]\n"
        },
    },
}

class TextFileWriter extends Step {
    static readonly declaration = declaration
    streams: { [key: string]: fs.WriteStream } = {}
    constructor(params: ParamsMap) {
        super(declaration, params)
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
            if (createdir && !fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
        } catch (e) {
            this.streams[filename] = null;
            this.error(`unable to create directory  ${dir} due to => ${e.message}`)
        }
        // create vs append to the file 
        const stream = fs.createWriteStream(filename, { flags, encoding: 'utf8' })
        stream.on('error', err => {
            stream.end();
            this.streams[filename] = null
            this.error(`unable to open file ${filename} due to => ${err.message}`)
        });
        stream.write(this.params.header, err => {
            err && this.error(`unable to write to file ${filename} due to => ${err.message}`)
        })
        this.streams[filename] = stream
        return stream
    }

    /**
     * 
     * @param inport  the output port ( on port "pojos" declared)
     * @param pojo the pojo to wrtie to the text file
     */
    async input(inport: string, pojo: any) {
        return new Promise((resolve,reject) => {
            const filename = this.params.filename
            const textline = this.params.textline
            const separator = this.params.separator
            const stream = this.getstream(filename)
            stream && stream.write(textline, err => {
                err && reject(new Error(`unable to write to file ${filename} due to => ${err.message}`))
                stream && stream.write(separator, err => {
                    err && reject(new Error(`unable to write to file ${filename} due to => ${err.message}`))
                    resolve()
                })
            })    
        })
    }

    /**
     * all the mainwrite process is done in input() method
     * process() method only write footers and close the stream pool  
     */
    async process() {
        return new Promise((resolve,reject) => {
            const keys = Object.keys(this.streams);
            let count = 0;
            keys.forEach(filename => {
                const stream = this.streams[filename]
                stream.write(this.params.footer, err => {
                    err && reject (new Error(`unable to write to file ${filename} due to => ${err.message}`))
                    if (stream) stream.close()
                    if (++count >= keys.length) resolve()
                })
            })
        })
    }

    /**
     * output all the filename outputed
     */
    async end() {
        for (let filename of Object.keys(this.streams)) {
            await this.output('files', { filename })
        }
    }

}

module.exports = Step.register(TextFileWriter)
