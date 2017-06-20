function stripClassCallCheck(babel) {
  return {
    name: 'strip-class-callcheck',
    visitor: {
      CallExpression: function(path) {
        const node = path.node;
        const callee = node.callee;

        if (!callee) {
          return;
        }

        if (callee.object &&
          callee.object.name === 'babelHelpers' &&
          callee.property.name === 'classCallCheck') {

          path.remove();
        } else if (callee.name === '_classCallCheck') {
          path.remove();
        }
      }
    }
  };
}

stripClassCallCheck.baseDir = function() {
  return __dirname;
};


module.exports = stripClassCallCheck;
