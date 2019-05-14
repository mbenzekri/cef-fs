# cef-fs
    a cef (cloud engine factory) plugin  library providing file system steps for file/directory operations
    to install: `npm install mbenzekri/cef-fs`

# summary
    - step [DirectoryWalker](##DirectoryWalker) : Directory recursive parser
    - step [DirectoryWatcher](##DirectoryWatcher) : Directory change watcher step
---
# DirectoryWalker
    Directory recursive parser

## goal

    Provide files from dir or subdir through a recursive walk

## parameters
        - directory {string} directory to walk 
        - pattern {regexp} regexp for file filtering by full pathname 
        - extension {regexp} regexp for file filtering by extension 

## inputs

## outputs
    - input **files** : output found filenames 
# DirectoryWatcher
    Directory change watcher step

## goal

    emit a pojo for each directory change

## parameters
        - directory {string} the directory to watch for changes 
        - created {boolean} if true output created files 
        - deleted {boolean} if true output deleted files  
        - pattern {regexp} base filename.ext pattern filter 

## inputs

## outputs
    - input **files** : changed files 
