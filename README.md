
# pojoe-fs: file system steps
>this module provides steps for files and directories management
# install

>`npm install mbenzekri/pojoe-fs`

# included steps 
>- [DirectoryWalker](#directorywalker-directory-tree-recursive-walk) : directory tree recursive walk
>- [DirectoryWatcher](#directorywatcher-directory-change-watcher-step) : directory change watcher step
>- [TextFileWriter](#textfilewriter-write-data-from-pojos-to-a-file) : write data from pojos to a file
>- [TextFileReader](#textfilereader-reads-data-from-a-file) : reads data from a file
>- [FileRemover](#fileremover-remove-files) : remove files
>- [DirectoryRemover](#directoryremover-remove-directories) : remove directories
>- [FileCopier](#filecopier-copy-files) : copy files
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
>|`[.](doc\|pdf)$`| doc and pdf files |
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
> **directory** *{string}* -- the directory to watch for changes  -- default = `/tmp`
> 
>| Value | Description | 
>|-------|-------------| 
>|`c:/tmp`| set parameter directory to a constant |
>|`${args.my_param_name}`| use a process parameter to set directory |
>|`${globs.my_glob_name}`| use a step global variable to set directory |
>|`${args.root}/${globs.prefix}_suffix}`| use mixed variables |
> **pattern** *{regexp}* -- full pathname regexp filter  -- default = `/.*/i`
> 
>| Value | Description | 
>|-------|-------------| 
>|`[.](doc\|docx)$`| select only doc and docx changes |
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
>>- **change** *{string}* -- nature of the change "created" or "deleted


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
> **filename** *{string}* -- the path and file name to write  -- default = `/tmp/myfile.log`
> 
> **createdir** *{boolean}* -- if true create the missing directories  -- default = `true`
> 
> **append** *{boolean}* -- if true and file exists append   -- default = `true`
> 
> **textline** *{string}* -- the text to be written on the file for each pojo  -- default = `${JSON.stringify(pojo)}`
> 
> **header** *{string}* -- text to write into the file before firt <textline> output  -- default = `[
`
> 
> **separator** *{string}* -- text to separate each outputed <textline>  -- default = `
`
> 
> **footer** *{string}* -- text to write to the file after all outputed <textline>   -- default = `]
`
> 
## inputs
>- **pojos** -- pojos which data need to be written 

## outputs
>- **files** -- files produced 
>> provided properties: 
>>- **filename** *{string}* -- created filename


---

# TextFileReader reads data from a file
>

## goal

>this step read  a file line by line and output a pojo for each line
>- allow  multiple filenames from input or single filename from parameter 
>- allow pojo construction from parsed inputed text line 
>- allow input text line regexp parsing/splitting 
>- allow header lines skiping 

---
## parameters
> **filename** *{string}* -- text file pathname to read  -- default = `/tmp/myfile.txt`
> 
> **encoding** *{string}* -- encoding of the files to read  -- default = `utf-8`
> 
> **skip** *{int}* -- number of line to skip  -- default = `1`
> 
> **splitter** *{regexp}* -- regexp grouping pattern to parse the line use local var "match" to get parsed result  -- default = `/^(.*)$/i`
> 
> **pojo** *{json}* -- the json pojo to output  -- default = `{ "line" : "${this.match[1]}" }`
> 
## inputs
>- **files** -- files to read 

## outputs
>- **pojos** -- pojos read from files 


---

# FileRemover remove files
>

## goal

>this step remove inputed files

---
## parameters
> **filename** *{string}* -- file pathname to remove  -- default = `/tmp/temp.txt`
> 
>| Value | Description | 
>|-------|-------------| 
>|`c:/tmp/temp.txt`| set parameter directory to a constant |
>|`${args.my_param_name}`| use a process parameter to set directory |
>|`${globs.my_glob_name}`| use a step global variable to set directory |
>|`${args.root}/${globs.prefix}_suffix}`| use mixed variables |
>|`${pojo.dirname}/tmp.txt`| use an inputed pojo property "dirname" from port "filesdirs"  |
> **pattern** *{regexp}* -- full pathname regexp filter  -- default = `/.*/i`
> 
>| Value | Description | 
>|-------|-------------| 
>|`/.*/i`| select all files |
>|`/[.](doc\|pdf)$/i`| doc and pdf files |
>|`/^d:/i`| only starting with "d:" |
>|`/^${args.root}//i`| only starting with process argument "root" |
## inputs
>- **files** -- pojos from which the files pathnames will be extracted 

## outputs
>- **removed** -- files removed successfully 
>> provided properties: 
>>- **filename** *{string}* -- path name of the file removed
>- **failed** -- files failed to remove 
>> provided properties: 
>>- **filename** *{string}* -- path name of the file failed to remove
>>- **reason** *{string}* -- reason of the failure


---

# DirectoryRemover remove directories
>

## goal

>this step remove inputed directories

---
## parameters
> **dirname** *{string}* -- directory pathname to remove  -- default = `/tmp/temp.txt`
> 
>| Value | Description | 
>|-------|-------------| 
>|`c:/tmp`| set parameter directory to a constant |
>|`${args.my_param_name}`| use a process parameter to set directory |
>|`${globs.my_glob_name}`| use a step global variable to set directory |
>|`${args.root}/${globs.prefix}_suffix}`| use mixed variables |
>|`${pojo.dirname}`| use an inputed pojo property "dirname" from port "filesdirs"  |
> **pattern** *{regexp}* -- full pathname regexp filter  -- default = `/.*/i`
> 
>| Value | Description | 
>|-------|-------------| 
>|`/.*/i`| select all files/directory |
>|`/[.](doc\|pdf)$/i`| doc and pdf files |
>|`/^d:/i`| only starting with "d:" |
>|`/^${args.root}//i`| only starting with process argument "root" |
> **recursive** *{boolean}* -- if true do a recursive remove on directories  -- default = `false`
> 
## inputs
>- **directories** -- pojos from which the directories pathnames will be extracted 

## outputs
>- **removed** -- directory removed successfully 
>> provided properties: 
>>- **dirname** *{string}* -- path name of the directory removed
>- **failed** -- directories failed to remove 
>> provided properties: 
>>- **dirname** *{string}* -- path name of the directory failed to remove
>>- **reason** *{string}* -- reason of the failure


---

# FileCopier copy files
>

## goal

>this step copy a source file to destination files

---
## parameters
> **source** *{string}* -- file pathname to copy  -- default = `/tmp/temp1.txt`
> 
> **target** *{string}* -- file pathname to copy  -- default = `/tmp/temp2.txt`
> 
> **exclusive** *{string}* -- true to ignore existing targets  -- default = `/tmp/temp2.txt`
> 
## inputs
>- **copy** -- pojos from which the source file and the destination file  pathnames will be extracted 

## outputs
>- **copied** -- files to copied successfully 
>> provided properties: 
>>- **source** *{string}* -- path name of the file to copy
>>- **target** *{string}* -- target path file name
>- **failed** -- files failed to copy 
>> provided properties: 
>>- **source** *{string}* -- path name of the file to copy
>>- **target** *{string}* -- target path file name
>>- **reason** *{string}* -- reason of the failure


---

---
