# Command line app to read top Hacker News posts

Read top Hackernews posts right from your command line.

# How to use?

**Install Node js.**
Hackernewscmd requires [Node.js](https://nodejs.org/) v4+ to run.

Follow [this link](http://blog.teamtreehouse.com/install-node-js-npm-mac) for detailed step by step installation process. 

Once you have installed node and npm you are ready to download and install the hackernewscmd using below command.

```sh
$ npm install -g hackernewscmd
```

Once installation is successful run the following command to get the top posts.
```sh
$ hackernews --posts 10
```
Above command will get the top 10 posts. You can specify any number here less than 100.

# For the nerds
**Server** - Node.js 
**Testing** - [Mocha](https://mochajs.org/) with [Chai](http://chaijs.com/).

**Important Packages used**
request - to make http requests top hackernews api
optimist - for processing command line arguments
cacheManager - for the basic caching of files in case of repeated requests.

# Run in local
Clone the repo
```sh
$ cd hackernewscmd
$ npm install
$ node hackernews.js --post 12
```

Run tests
```sh
$ npm test
```




License
----

MIT

Author: @SoorajChandran
Date: 5 Dec 2017