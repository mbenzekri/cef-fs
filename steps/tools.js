"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
/**
 * walk recursively a directory and output files mattching pattern and in extension list
 * @param pathname the directory to walk
 * @param recursive walk recursively the directory tree
 * @param  cbpojo a callback to be called for each file/dir walked/found
 */
function walk(pathname, recursive, cbpojo) {
    return __awaiter(this, void 0, void 0, function* () {
        let stack = [pathname];
        // faire l'algo avec une pile impossible avec expected + resolved !!!!
        // -------------------------------------------------------------------------
        const dirwalk = (dirname, files, resolve, reject) => {
            if (files.length) {
                const pathname = path.join(dirname, files.pop());
                let stats;
                try {
                    stats = fs.statSync(pathname);
                }
                catch (err) {
                    return reject(err);
                }
                let pojo = {};
                pojo = Object.keys(stats).reduce((pojo, prop) => {
                    if (typeof stats[prop] !== 'function')
                        pojo[prop] = stats[prop];
                    return pojo;
                }, pojo);
                pojo.pathname = pathname;
                pojo.isdir = stats.isDirectory();
                pojo.isfile = stats.isFile();
                pojo.isdir && stack.push(pojo.pathname);
                if (pojo.isdir || pojo.isfile) {
                    return cbpojo(pojo).then(() => dirwalk(dirname, files, resolve, reject)).catch(e => reject(e));
                }
                else {
                    return dirwalk(dirname, files, resolve, reject);
                }
            }
            resolve();
        };
        const treewalk = (resolve, reject) => {
            if (stack.length === 0)
                return resolve();
            const dirname = stack.pop();
            fs.readdir(dirname, (err, files) => {
                if (err)
                    return reject(err);
                new Promise((resolve, reject) => {
                    dirwalk(dirname, files, resolve, reject);
                }).then(_ => {
                    treewalk(resolve, reject);
                }).catch(e => {
                    reject(e);
                });
            });
        };
        return new Promise(treewalk);
    });
}
exports.walk = walk;
function remove(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            fs.unlink(filename, err => {
                if (err)
                    reject(err);
                if (!err)
                    resolve();
            });
        });
    });
}
exports.remove = remove;
function rmdir(dirname) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            fs.rmdir(dirname, err => {
                if (err)
                    reject(err);
                if (!err)
                    resolve();
            });
        });
    });
}
exports.rmdir = rmdir;
function copy(source, target, exclusive) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const flags = exclusive ? fs.constants.COPYFILE_EXCL : 0;
            fs.copyFile(source, target, flags, err => {
                if (err)
                    reject(err);
                if (!err)
                    resolve();
            });
        });
    });
}
exports.copy = copy;
//# sourceMappingURL=tools.js.map