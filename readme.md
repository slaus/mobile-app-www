Installation
============

Prerequisites
-------------

### Unix
1. npm
2. bower (npm install -g bower)

### Windows
1. git for windows (including gitBash) https://github.com/git-for-windows/git/releases/tag/v2.12.2.windows.2
2. npm (from node.js package) https://nodejs.org/en/download/
3. bower (npm install -g bower)

Install
-------
### open terminal (for Windows users gitBash)
### change directory to your dev folder
 
```bash
$ cd /path/to/your/dev/folder
```

### clone repository

```bash
$ git clone ssh://git@bitbucket.org/420cloud/mobile-app-www.git
```

You may also clone this using https:

```bash
$ git clone https://<your_bitbucket_account>@bitbucket.org/420cloud/mobile-app-www.git
```

# switch directory to the mobile-app-www
```bash
$ cd mobile-app-www/
```

### switch branch to develop
```bash
$ git checkout develop
```

### install npm libraries

```bash
$ npm install
```

### install bower libraries

```bash
$ bower install
```

### build and start app

```bash
$ gulp serve
```

This will start local server on http://localhost:3000/ with file watcher and all required tools to handle *.scss changes/build