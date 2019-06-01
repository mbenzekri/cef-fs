
import * as fs from 'fs'
import * as path from 'path'

/**
 * walk recursively a directory and output files mattching pattern and in extension list
 * @param pathname the directory to walk
 * @param recursive walk recursively the directory tree 
 * @param  cbpojo a callback to be called for each file/dir walked/found  
 */

async function walk(pathname: string, recursive: boolean, cbpojo: (stats: any) => Promise<void>) {
    let stack = [pathname]
    // faire l'algo avec une pile impossible avec expected + resolved !!!!
    // -------------------------------------------------------------------------
    const dirwalk = (dirname: string, files: string[], resolve, reject) => {
        if (files.length) {
            const pathname = path.join(dirname, files.pop())
            let stats: fs.Stats
            try { stats = fs.statSync(pathname) }
            catch (err) { return reject(err) }
            let pojo: any = {}
            pojo = Object.keys(stats).reduce((pojo, prop) => {
                if (typeof stats[prop] !== 'function') pojo[prop] = stats[prop];
                return pojo
            }, pojo)
            pojo.pathname = pathname
            pojo.isdir = stats.isDirectory()
            pojo.isfile = stats.isFile()
            pojo.isdir && stack.push(pojo.pathname)
            if (pojo.isdir || pojo.isfile) {
                return cbpojo(pojo).then(() => dirwalk(dirname, files, resolve, reject)).catch(e => reject(e))
            } else {
                return dirwalk(dirname, files, resolve, reject)
            }
        }
        resolve()
    }
    const treewalk = (resolve, reject) => {
        if (stack.length === 0) return resolve()
        const dirname = stack.pop()
        fs.readdir(dirname, (err, files) => {
            if (err) return reject(err)
            new Promise((resolve, reject) => {
                dirwalk(dirname, files, resolve, reject)
            }).then(_ => {
                treewalk(resolve, reject)
            }).catch(e => {
                reject(e)
            })
        })
    }
    return new Promise(treewalk)
}

async function remove(filename: string) {
    return new Promise<any>((resolve,reject) => {
        fs.unlink(filename, err => { 
           if (err) reject(err)
           if (!err) resolve()
       })
    })    
}

async function rmdir(dirname: string) {
    return new Promise<any>((resolve,reject) => {
        fs.rmdir(dirname, err => { 
           if (err) reject(err)
           if (!err) resolve()
       })
    })    
}

export { walk, remove, rmdir }