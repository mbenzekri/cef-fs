
# cef-fs: file system steps
>this pojo engine step library provides files and directories management steps
# install

>`npm install mbenzekri/cef-fs`

# included steps 
>- [DirectoryWalker](#directorywalker-directory-tree-recursive-walk) : directory tree recursive walk
>- [DirectoryWatcher](#directorywatcher-directory-change-watcher-step) : directory change watcher step
>- [TextFileWriter](#textfilewriter-write-data-from-pojos-to-a-file) : write data from pojos to a file
---
# DirectoryWalker directory tree recursive walk
>

## goal

>this step does a tree recursive walk and outputs each directories and/or files found
>- allow file search through a directory walking  
>- allow recursive or flat walk 
>- allow type file/directory filter 
>- allow regexp filtering for full pathname directories and/or files 

---
## parameters
> **directory** *{string}* -- directory pathname to walk  -- default = `c:/tmp`
> 
>| Value | Description | 
>|-------|-------------| 
>|`c:/tmp`| set parameter directory to a constant |
>|`${args.my_param_name}`| use a process parameter to set directory |
>|`${globs.my_glob_name}`| use a step global variable to set directory |
>|`${args.root}/${globs.prefix}_suffix}`| use mixed variables |
>|`${pojo.dirname}`| use an inputed pojo property "dirname" from port "files |

> **pattern** *{regexp}* -- full pathname regexp filter  -- default = `.*`
> 
>| Value | Description | 
>|-------|-------------| 
>|`.*`| select all files/directory |
>|`[.](doc|pdf)$`| doc and pdf files |
>|`^d:`| only starting with "d:" |
>|`^${args.root}/`| only starting with process argument "root" |

> **recursive** *{boolean}* -- if true do a recursive walk  -- default = `false`
> 

> **outdirs** *{boolean}* -- if true output directories  -- default = `true`
> 

> **outfiles** *{boolean}* -- if true output files  -- default = `true`
> 


## outputs
>- **files** -- for each selected file or directory a pojo is outputed through this port 
>> provided properties: 
>>- **pathname** *{string}* -- path name of the file
>>- **isdir** *{boolean}* -- true if pathname is a directory
>>- **isfile** *{boolean}* -- true if pathname is a file


---

# DirectoryWatcher directory change watcher step
>

## goal

>this step emits a pojo for each change in a given directory
>- allow directory change detection 
>- allow regexp filtering for full pathname directories/files 
>- allow change type filtering (create and/or deleted 

---
## parameters
> **directory** *{string}* -- the directory to watch for changes  -- default = `c:/tmp`
> 
>| Value | Description | 
>|-------|-------------| 
>|`c:/tmp`| set parameter directory to a constant |
>|`${args.my_param_name}`| use a process parameter to set directory |
>|`${globs.my_glob_name}`| use a step global variable to set directory |
>|`${args.root}/${globs.prefix}_suffix}`| use mixed variables |

> **pattern** *{regexp}* -- full pathname regexp filter  -- default = `.*`
> 
>| Value | Description | 
>|-------|-------------| 
>|`[.]()(doc|docx)`| select  |
>|`^[^C]:`| avoid "C:" starting paths  |
>|`^[A-Z]:`| must be absolute pathname |
>|`.*${globs.asubstr}.*`| must contain a known substring |

> **created** *{boolean}* -- if true output created files  -- default = `true`
> 

> **deleted** *{boolean}* -- if true output deleted files   -- default = `true`
> 


## outputs
>- **files** -- changed files or directory 
>> provided properties: 
>>- **pathname** *{string}* -- path name of the file or directory
>>- **isdir** *{boolean}* -- true if pathname is a directory
>>- **isfile** *{boolean}* -- true if pathname is a file


---

# TextFileWriter write data from pojos to a file
>

## goal

>this step writes user formated data in a text file for each inputed pojo
>- allow writing some data for each pojo inputed 
>- allow full directory path creation if missing 
>- allow file create or append mode 
>- allow header and footer output 

---
## parameters
> **filename** *{string}* -- the path and file name to write  -- default = `c:/tmp/myfile.log`
> 

> **createdir** *{boolean}* -- if true create the missing directories  -- default = `true`
> 

> **append** *{boolean}* -- if true and file exists append   -- default = `true`
> 

> **textline** *{string}* -- the text to be written on the file for each pojo  -- default = `${JSON.stringify(pojo)}`
> 

> **header** *{string}* -- text to write into the file before pojo outputing  -- default = `null`
> 

> **footer** *{string}* -- text to write into the file after all pojos outputed  -- default = `null`
> 

## inputs
>- **pojos** -- pojos which data need to be written 

## outputs
>- **files** -- files produced 
>> provided properties: 
>>- **filename** *{string}* -- created filename


---

