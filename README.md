# cef-fs
>a cef plugin library (**pojo engine factory**)providing **file system steps** for file/directory operations
>to install: `npm install mbenzekri/cef-fs`

# summary
>- step [DirectoryWalker](#directorywalker) : Directory recursive parser
>- step [DirectoryWatcher](#directorywatcher) : Directory change watcher step
---
# DirectoryWalker
>Directory recursive parser

## goal

>Provide files from dir or subdir through a recursive walk

## parameters
>- <b style="text-decoration:underline;">directory</b> **<i>{string}</i>** directory to walk 
>- <b style="text-decoration:underline;">pattern</b> **<i>{regexp}</i>** regexp for file filtering by full pathname 
>- <b style="text-decoration:underline;">extension</b> **<i>{regexp}</i>** regexp for file filtering by extension 

## inputs

## outputs
>- **files** : output found filenames 

---
# DirectoryWatcher
>Directory change watcher step

## goal

>emit a pojo for each directory change

## parameters
>- **directory** {string} the directory to watch for changes 
>- **created** {boolean} if true output created files 
>- **deleted** {boolean} if true output deleted files  
>- **pattern** {regexp} base filename.ext pattern filter 

## inputs

## outputs
>- **files** : changed files 
