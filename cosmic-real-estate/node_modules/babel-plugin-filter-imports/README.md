# babel-plugin-filter-imports

[![Build Status](https://travis-ci.org/ember-cli/babel-plugin-filter-imports.svg?branch=master)](https://travis-ci.org/ember-cli/babel-plugin-filter-imports)

*This plugin is for Babel 6. If you need to support Babel 5 use the [v0.2.x](https://github.com/ember-cli/babel-plugin-filter-imports/tree/v0.2.x) branch.*

This babel plugin is used to removed references to imports within a module. This can be useful for removing debugging statements when doing a production build of your code. It is often used in conjunction with other tools like Uglify that perform dead code elimination.

## Example

Given the `.babelrc`

```json
{
  "plugins": [["filter-imports", {
    "debugging-tools": [ "warn" ]
  }]]
}
```

the module

```js
import { warn } from 'debugging-tools';

function join(args, sep) {
  if (arguments.length > 2) {
    warn("join expects at most 2 arguments");
  }
  return args.join(sep);
}
```

will be transformed to

```js
import { warn } from 'debugging-tools';

function join(args, sep) {
  if (arguments.length > 2) {
  }
  return args.join(sep);
}
```

## Configuration

- `options` `[Object]`: An object whose keys are names of modules.
- `options[moduleName]` `[String]`: An array of names of imports from `moduleName` to be removed. You can include `'default'` for default export and `'*'` for a namespace export.
