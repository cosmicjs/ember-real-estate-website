var expect = require('expect.js');
var info = require('../');

var fixture = function(path) {
  return require('./fixtures/' + path);
};

describe('npm-git-info', function() {
  it('should detect info from branch specification', function() {
    var subject = info(fixture('branch.json'));

    expect(subject).to.eql({
      name: 'ember-data',
      version: "2.4.0-beta.1",
      sha: "86f89cbed2a2218368dc652fdb74d8553efaa76c",
      abbreviatedSha: "86f89cbed2",
      ref: "beta"
    });

    expect(subject.isInstalledAsNpmPackage()).to.be(true);
    expect(subject.hasVersionInRef()).to.be(false);
  });

  it('should detect info from tag specification', function() {
    var subject = info(fixture('tag.json'));

    expect(subject).to.eql({
      name: 'ember-data',
      version: "2.4.0-beta.1",
      sha: "07ad5fe7e43216c5d9fd70412a9761d6c7164e88",
      abbreviatedSha: "07ad5fe7e4",
      ref: "v2.4.0-beta.1"
    });

    expect(subject.isInstalledAsNpmPackage()).to.be(true);
    expect(subject.hasVersionInRef()).to.be(true);
  });

  it('should detect info from without specification', function() {
    var subject = info(fixture('master.json'));

    expect(subject).to.eql({
      name: 'ember-data',
      version: "2.5.0-canary",
      sha: "6188c6830d33dbda55bdb59e971984d5803320cb",
      abbreviatedSha: "6188c6830d",
      ref: undefined
    });

    expect(subject.isInstalledAsNpmPackage()).to.be(true);
    expect(subject.hasVersionInRef()).to.be(false);
  });

  it('should detect info from not NPM installed package', function() {
    var subject = info(fixture('repository.json'));

    expect(subject).to.eql({
      name: 'ember-data',
      version: '2.5.0-canary',
      sha: undefined,
      abbreviatedSha: undefined,
      ref: undefined
    });

    expect(subject.isInstalledAsNpmPackage()).to.be(false);
    expect(subject.hasVersionInRef()).to.be(false);
  });

  it('should detect info from NPM installed package with version', function() {
    // this tests the result of: npm install ember-data@2.4.0
    var subject = info(fixture('npm-version.json'));

    expect(subject).to.eql({
      name: 'ember-data',
      version: '2.4.0',
      sha: '9f8c40927a5e8a7966c251d99eb26c3f1fb0606e',
      abbreviatedSha: '9f8c40927a',
      ref: '2.4.0'
    });

    expect(subject.isInstalledAsNpmPackage()).to.be(true);
    expect(subject.hasVersionInRef()).to.be(true);
  });

  it('should detect info from NPM v2 installed package with version', function() {
    // this tests the result of: npm install ember-data@2.4.0, using npm v2
    var subject = info(fixture('npm-2-version.json'));

    expect(subject).to.eql({
      name: 'ember-data',
      version: '2.4.0',
      sha: '9f8c40927a5e8a7966c251d99eb26c3f1fb0606e',
      abbreviatedSha: '9f8c40927a',
      ref: '2.4.0'
    });

    expect(subject.isInstalledAsNpmPackage()).to.be(true);
    expect(subject.hasVersionInRef()).to.be(true);
  });

  it('should detect info from NPM installed package without a version', function() {
    // this tests the result of: npm install ember-data
    var subject = info(fixture('npm-without-version.json'));

    expect(subject).to.eql({
      name: 'ember-data',
      version: '2.4.0',
      sha: '9f8c40927a5e8a7966c251d99eb26c3f1fb0606e',
      abbreviatedSha: '9f8c40927a',
      ref: '2.4.0'
    });

    expect(subject.isInstalledAsNpmPackage()).to.be(true);
    expect(subject.hasVersionInRef()).to.be(true);
  });

  it('should detect info from NPM installed package with a range', function() {
    // this tests the result of: npm install ember-data@^2.4.3
    var subject = info(fixture('range.json'));

    expect(subject).to.eql({
      name: 'ember-data',
      version: '2.4.3',
      sha: 'a3e2521f85c91f18dd455f316572068566ff1a3b',
      abbreviatedSha: 'a3e2521f85',
      ref: '2.4.3'
    });

    expect(subject.isInstalledAsNpmPackage()).to.be(true);
    expect(subject.hasVersionInRef()).to.be(true);
  });
});
