import cef from 'cef-lib'
import gdal from 'gdal'
import path from 'path'
import fs from 'fs'

const declaration = new cef.Declaration({
    gitid: 'DirectoryWalker@mbenzekri/cef-fs',
    title: 'Directory recursive parser',
    desc: 'Provide files from dir or subdir through a recursive walk',
    inputs: {
    },
    outputs: {
        'files': {
            desc: 'output found filenames'
        }
    },
    parameters: {
        'directory': {
            desc: 'directory to walk',
            type: 'string'
        },
        'pattern': {
            desc: 'file pattern for file filtering',
            type: 'regexp'
        },
        'extensions': {
            desc: 'list of comma separated extensions for file filtering',
            type: 'string[]'
        }
    },
    fields: [
        {
            key: 'directory',
            type: 'text',
            templateOptions: {
                label: 'Directory to walk',
                required: true,
            }
        },
        {
            key: 'pattern',
            type: 'text',
            defaultValue: '.*',
            templateOptions: {
                label: 'regexp pattern filter',
                required: true,
            }
        },
        {
            key: 'extensions',
            type: 'text',
            defaultValue: '*',
            templateOptions: {
                label: 'file extension list ',
                required: true,
            }
        },
    ]
})


class DirectoryWalker extends cef.Step {

    /**
     * walk recursively a directory and output files mattching pattern and in extension list
     * @param {string} dir : the directory to walk
     * @param {RegExp} pattern : the pattern filter
     * @param {string[]} extensions : the extension list filter 
     */
    walk(dir, pattern, extensions) {
        fs.readdirSync(dir).forEach(f => {
            let dirPath = path.join(dir, f);
            if (fs.statSync(dirPath).isDirectory()) {
                this.walkDir(dirPath, callback)
            } else {
                const filename = path.join(dir, f);
                if (pattern.test(filename) && extensions.includes(path.extname(filename))) {
                    this.output('files', {filename})
                }
            }
        });
    }    
    start() {
        const directory = this.params['directory']
        const pattern = this.params['pattern']
        const extensions = this.params['extensions']
        this.walk(directory,pattern,extensions)
        this.close('features')
    }
}

export { declaration, DirectoryWalker }
