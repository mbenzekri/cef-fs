/**
 * walk recursively a directory and output files mattching pattern and in extension list
 * @param pathname the directory to walk
 * @param recursive walk recursively the directory tree
 * @param  cbpojo a callback to be called for each file/dir walked/found
 */
declare function walk(pathname: string, recursive: boolean, cbpojo: (stats: any) => Promise<void>): Promise<{}>;
declare function remove(filename: string): Promise<any>;
declare function rmdir(dirname: string): Promise<any>;
export { walk, remove, rmdir };
