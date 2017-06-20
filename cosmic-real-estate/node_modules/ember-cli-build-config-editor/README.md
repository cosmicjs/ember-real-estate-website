[![Build Status](https://travis-ci.org/srvance/ember-cli-build-config-editor.svg?branch=master)](https://travis-ci.org/srvance/ember-cli-build-config-editor)
[![Dependency Status](https://david-dm.org/srvance/ember-cli-build-config-editor/status.svg)](https://david-dm.org/srvance/ember-cli-build-config-editor) 
[![devDependency Status](https://david-dm.org/srvance/ember-cli-build-config-editor/dev-status.svg)](https://david-dm.org/srvance/ember-cli-build-config-editor?type=dev)
[![Greenkeeper badge](https://badges.greenkeeper.io/srvance/ember-cli-build-config-editor.svg)](https://greenkeeper.io/)
[![Ember Observer](https://emberobserver.com/badges/ember-cli-build-config-editor.svg)](https://emberobserver.com/addons/ember-cli-build-config-editor)

# Ember CLI Build Config Editor

Utility for ember blueprints to use to modify ember-cli-build.js

## Installation for Use

For installation in a non-Ember project:

```commandline
npm install ember-cli-build-config-editor --save-dev
```

For installation in an Ember project:

```commandline
ember install ember-cli-build-config-editor
```

## Usage

Note: This package only handles flat configurations at this point.

### Querying configuration

```js
var BuildConfigEditor = require('ember-cli-build-config-editor.js');
var fs = require('fs');

// Specify 'utf-8' to force it to be a string instead of a buffer
var source = fs.readFileSync('./ember-cli-build.js', 'utf-8');

var build = new BuildConfigEditor(source);

var config = build.retrieve('some-addon');

// Do something with the config
```

### Adding or editing configuration

Use this from your Ember blueprint to add or update configuration options in your `ember-cli-build.js`.

```js
var BuildConfigEditor = require('ember-cli-build-config-editor.js');
var fs = require('fs');

// Specify 'utf-8' to force it to be a string instead of a buffer
var source = fs.readFileSync('./ember-cli-build.js', 'utf-8');

var build = new BuildConfigEditor(source);

build.edit('some-addon', {
    booleanProperty: false,
    numericProperty: 17,
    stringProperty: 'wow'
});

fs.writeFileSync('./ember-cli-build.js', build.code());
```

## What It Does

The above example modifies `ember-cli-build.js` in the following ways

* Finds the `'some-addon'` key in the options object of your `EmberApp` construction, creating one
if it doesn't exist
* For each of the entries in the passed object, it adds property or updates it if it already
exists with the specified value.

Keys that are not specified are preserved untouched. Added object keys are single-quoted for safety.

## Troubleshooting

> TypeError: this.source.charCodeAt is not a function

You have passed a buffer instead of a string to the constructor. Add the `encoding` argument
when you read the file, e.g., `var source = fs.readFileSync('./ember-cli-build.js', 'utf-8')`.
  
## Development

### Installation for Development

* Fork and clone the repo
* cd into the project directory
* `npm install`

## Running tests

```commandline
npm test
```

### Understanding JavaScript ASTs

The AST for [the basic configuration](./tests/fixtures/single-config-block.js) can be found in
[this SVG](./docs/ember-cli-build-ast.svg) for reference. It was generated from
[Rappid's JavaScript AST Visualizer](http://resources.jointjs.com/demos/javascript-ast).

The approach used here is based on that for [ember-router-generator](https://github.com/ember-cli/ember-router-generator).

The [DSL for AST types](https://github.com/benjamn/ast-types/blob/master/def/core.js) used by esprima provided great
insight once I got my head around it.

## Contributing

Please fork the project and submit pull requests and issues using GitHub.
