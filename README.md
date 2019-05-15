# Pojo engine library: cef-fs
>a pojo engine steps library providing file system operations

# install

>`npm install mbenzekri/cef-fs`

# summary
>- step [DirectoryWalker](#step-directorywalker) : Directory tree recursive walk and output
>- step [DirectoryWatcher](#step-directorywatcher) : Directory change watcher step
>- step [FileLogger](#step-filelogger) : Pojo file logger
---
# step DirectoryWalker : Directory tree recursive walk and output
>

## goal

>This step does a tree recursive walk and outputs every directories or files found
>- allow directory tree walking  
>- allow recursive or flat walk 
>- allow type file/directory filter 
>- allow regexp filtering for full pathname directories/files 

---
## parameters
### **directory**: *{string}* -- directory pathname to walk [default = `c:/tmp`]
>| Value | Description | 
>|-------|-------------| 
>|`c:/tmp`| set parameter directory to a constant |
>|`${args.my_param_name}`| use a process parameter to set directory |
>|`${globs.my_glob_name}`| use a step global variable to set directory |
>|`${args.root}/${globs.prefix}_suffix}`| use mixed variables |
>|`${pojo.dirname}`| use an inputed pojo property "dirname" from port "files |
### **pattern**: *{regexp}* -- full pathname regexp filter [default = `.*`]
>| Value | Description | 
>|-------|-------------| 
>|`.*`| select all files/directory |
>|`[.](doc|pdf)$`| doc and pdf files |
>|`^d:`| only starting with "d:" |
>|`^${args.root}/`| only starting with process argument "root" |
### **recursive**: *{boolean}* -- if true do a recursive walk [default = `false`]
### **outdirs**: *{boolean}* -- if true output directories [default = `true`]
### **outfiles**: *{boolean}* -- if true output filtes [default = `true`]


## outputs
>- **files** -- output found filenames 

---

# step DirectoryWatcher : Directory change watcher step
>

## goal

>emit a pojo for each directory change
>- allow directory change watching  
>- allow regexp filtering for full pathname directories/files 
>- allow change type filtering (create and/or deleted 

---
## parameters
### **directory**: *{string}* -- the directory to watch for changes [default = `c:/tmp`]
>| Value | Description | 
>|-------|-------------| 
>|`c:/tmp`| set parameter directory to a constant |
>|`${args.my_param_name}`| use a process parameter to set directory |
>|`${globs.my_glob_name}`| use a step global variable to set directory |
>|`${args.root}/${globs.prefix}_suffix}`| use mixed variables |
### **pattern**: *{regexp}* -- full pathname regexp filter [default = `.*`]
>| Value | Description | 
>|-------|-------------| 
>|`c:/tmp`| set parameter directory to a constant |
>|`${args.my_param_name}`| use a process parameter to set directory |
>|`${globs.my_glob_name}`| use a step global variable to set directory |
>|`${args.root}/${globs.prefix}_suffix}`| use mixed variables |
### **created**: *{boolean}* -- if true output created files [default = `true`]
### **deleted**: *{boolean}* -- if true output deleted files  [default = `c:	mps`]


## outputs
>- **files** -- changed files 

---

# step FileLogger : Pojo file logger
>

## goal

>Logs inputed pojos data to a file
>- allow writing data for each pojo inputed 
>- allow creation dir if not present 
>- allow append mode 

---
## parameters
### **filename**: *{string}* -- the log file name full path and name [default = `c:	mpmylogfile.log`]
### **createdir**: *{boolean}* -- if true create the absent directories [default = `true`]
### **append**: *{boolean}* -- if true and file exists append  [default = `true`]
### **message**: *{string}* -- the message to be outputed for each pojo [default = `${JSON.stringify(pojo)}`]
### **header**: *{string}* -- text to log into the file before pojo outputing [default = `null`]
### **footer**: *{string}* -- text to log into the file after all pojos outputed [default = `null`]

## inputs
>- **pojos** -- pojos to be logged 

## outputs
>- **files** -- files produced 

---

