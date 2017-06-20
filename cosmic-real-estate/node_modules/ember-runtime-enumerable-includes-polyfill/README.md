# ember-runtime-enumerable-includes-polyfill

This addon polyfills the `ember-runtime-enumerable-includes` feature added to Ember 
in 2.8.0. This addon is intended to allow addons and/or applications use the new 
functionality and avoid deprecations while still supporting older Ember versions.

Read more details on the feature here:

* [emberjs/rfcs#136](https://github.com/emberjs/rfcs/pull/136)
* [Deprecation Guide](http://emberjs.com/deprecations/v2.x/#toc_enumerable-contains)

[![Build Status](https://travis-ci.org/rwjblue/ember-runtime-enumerable-includes-polyfill.svg?branch=master)](https://travis-ci.org/rwjblue/ember-runtime-enumerable-includes-polyfill)

## Usage
To use this addon in your project, install it as a runtime dependency:

```bash
npm install --save ember-runtime-enumerable-includes-polyfill
```

That's it!

## Installation

* `git clone <repository-url>` this repository
* `cd ember-runtime-enumerable-includes-polyfill`
* `npm install`
* `bower install`

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://ember-cli.com/](http://ember-cli.com/).
