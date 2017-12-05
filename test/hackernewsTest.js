const request = require('request');
const chai = require('chai');
const expect = require('Chai').expect;
const should = chai.should();
const chaiHttp = require('chai-http');
const assert = require('chai').assert;
const app = require('../hackernews');

chai.use(chaiHttp);


describe('Hackernews',function(){

  it('init() - Post number cannot be greater than 100',function(){
    let result = app.init("1000");
    assert.equal(result,false);
  })

  it('initRequest() should respond with a valid json data', function(done) {
    request.get('https://hacker-news.firebaseio.com/v0/topstories.json', function (err, res, body){
      expect(res.statusCode).to.equal(200);
      res.should.be.json;
      let result = JSON.parse(body);
      result.should.be.a('array');
      done();
    });
  });

  it("handlePosts() should return promise all object", function(done) {
    app.handlePosts('[ 8952, 9224, 8917, 8884, 8887, 8943]', function(err, result) {
        result.should.be.an('object');
      });
    done();
  });

  it('performRequest() should respond with a valid json data', function(done) {
    request.get('https://hacker-news.firebaseio.com/v0/item/8863.json?print=pretty', function (err, res, body){
      expect(res.statusCode).to.equal(200);
      res.should.be.json;
      let result = JSON.parse(body);
      expect(result).to.have.property("title");
      expect(result).to.have.property("by");
      expect(result).to.have.property("kids");
      expect(result).to.have.property("score");
      expect(result).to.have.property("url");
      done();
    });
  });

  it("performRequest() should return a promise", function (done) {
    let promise = app.performRequest('https://hacker-news.firebaseio.com/v0/item/8863.json?print=pretty');
    expect(promise).to.be.a('promise');
    done();
  });

  it("isArrayEqual() should return true for equal array", function (done) {
    let result = app.isArrayEqual([5,10,15],[5,10,15]);
    assert.equal(result,true);
    done();
  });

  it("isArrayEqual() should return true for unequal array", function (done) {
    let result = app.isArrayEqual([15,10,15],[5,10,15]);
    assert.equal(result,false);
    done();
  });


  it('isValid() return true for valid data', function(done) {
    const obj = { by: 'jondoe',
    descendants: 131,
    id: 15836027,
    kids: 
     [ 15836210,
       15836566,
       15836281],
    score: 207,
    time: 1512276915,
    title: 'Maintaining an Independent Browser Is Expensive',
    type: 'story',
    url: 'http://robert.ocallahan.org/2017/12/maintaining-independent-browser-is.html' }

    let result = app.isValid(obj);
    assert.equal(result,true);
    done();
  });

  it('isValid() return false for invalid data', function(done) {
    const obj = { by: 'jonchang',
    descendants: 131,
    id: 15836027,
    kids: 
     [ 15836210 ],
    score: 207,
    time: 1512276915,
    title: 'Maintaining an Independent Browser Is Expensive',
    type: 'story',
    url: 'some wrong url' }

    let result = app.isValid(obj);
    assert.equal(result,false);
    done();
  });

});