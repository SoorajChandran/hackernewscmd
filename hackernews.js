#!/usr/bin/env node
const request = require('request');
const optimist = require('optimist'); //to process the command line args
const validUrl = require('valid-url'); //to validate URI
const cacheManager = require('cache-manager'); 
const fsStore = require('cache-manager-fs'); //file-system cache required since this is a command line app
const diskCache = cacheManager.caching({store: fsStore, options: {ttl: 10000, maxsize: 1000*1000*1000, path:'diskcache', preventfill:false}});
const postsCount = optimist.argv["posts"];
let itemUrl = "https://hacker-news.firebaseio.com/v0/item/**id**.json?print=pretty";
const topPostsUrl = "https://hacker-news.firebaseio.com/v0/topstories.json";
const output = [];
let obj = {};
const maxPostCount = 100; //maximum number of posts that can be obtained set to 100

const app = {
  // init(postCount) - to validate postCount and initiate api call
  init: function(postsCount){
    that = this;
    if(postsCount && postsCount <= maxPostCount){
      that.initRequest(topPostsUrl);
    }else if(isNaN(postsCount)){
      console.log("Oops!Enter a valid number of posts.");
      return false;
    }else{
      console.log("Oops!Post number can't be greater than 100.");
      return false;
    }
  },
  // checkCache(newData) - to compare new top posts with cached top posts
  checkCache: function(newData){
    that = this;
    diskCache.get('topPosts', function(err, cachedData) {
    //fallback in case fs-cache is not supported
    if(!cachedData){
      return;
    }
    if(that.isArrayEqual(JSON.parse(cachedData),JSON.parse(newData))){
        that.getResultFromCache();
      }          
    });   
  },
  //getResultFromCache() get the post data from cache if cached data and new data is the same
  getResultFromCache: function(){
    that = this;
    diskCache.get('requestsResult', function(err, cachedData) {
      if(!cachedData){
        return;
      }
      that.finalOutput(cachedData);
    }); 
  },
  //initRequest(url) - initiate request for top posts
  initRequest: function(url){
    that = this;
    request.get(topPostsUrl, function(err,response,body){
      if(err) throw err;
      that.checkCache(body);
      that.handlePosts(body).then(that.finalOutput);
      diskCache.set('topPosts', body, {ttl: 3600}, function(err) {
        if (err) { throw err; }
      });
    })
  },
  //handlePosts(posts) - get post data from post ids
  handlePosts: function(posts){
    that = this;
    const postsArray = JSON.parse(posts);
    const requests = [];
    for(var i=0; i < postsCount; i++) {
      requests.push(that.performRequest(itemUrl.replace("**id**", postsArray[i])));
    }
    //cache the post data for reuse in case top posts doesn't change
    diskCache.set('requestsResult', requests, {ttl: 3600}, function(err) {
      if (err) { throw err; }
    });
    return Promise.all(requests);
  },
  //performRequest(url) request data of one post 
  performRequest: function(url){
    return new Promise(function(resolve, reject) {
      request.get(url, function(err,response,body){
        if(err) return reject(err);
        return resolve(body);
      })
    })
  },
  //finalOutput(requestsResult) - process the final output in the required format
  finalOutput: function(requestsResult){
    that = this;
    for(var i=0; i < requestsResult.length;i++){
      data = JSON.parse(requestsResult[i]);
      if(app.isValid(data)){ 
      obj = {
        "title": data.title,
        "uri": data.url,
        "author": data.by,
        "points": data.score,
        "comments": (data.kids && data.kids.length) || 0,
        "rank": i+1
      }
        output.push(obj);
      }
    }
    console.log(output);
  },
  // isArrayEqual(arr1,arr2) - check if two arrays are equal
  isArrayEqual: function(arr1,arr2){
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
    }
    return true;
  },
  // isValid(data) - check if each post data is valid
  isValid: function(data){
    if(!data.title || data.title.length >= 256){
    return false;
    }else if(data.score < 0 || (data.kids && data.kids.length < 0)){
      return false;
    }else if(!validUrl.isUri(data.url)){
      return false;
    }
    return true;
  }
}
//app starts here
app.init(postsCount);

module.exports = app;
