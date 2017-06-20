module.exports = function(babel) {
  return {
    visitor: {
      Program: function(path, state) {
        // A stack of booleans that determine whether an expression statement
        // should be removed as it is exited. Expression statements are removed
        // when they contain a reference to a filtered imported.
        state.shouldRemove = [];
      },

      ExpressionStatement: {
        enter: function(path, state) {
          state.shouldRemove.push(false);
        },
        exit: function(path, state) {
          if (state.shouldRemove.pop()) {
            path.remove();
          }
        }
      },

      Identifier: function(path, state) {
        // Ensure that we're inside of an expression statement.
        if (state.shouldRemove.length > 0) {
          if (referencesFilteredImport(path, state.opts)) {
            state.shouldRemove[state.shouldRemove.length - 1] = true;
          }
        }
      }
    }
  };
};

function referencesFilteredImport(identifier, filteredImports) {
  for (var moduleName in filteredImports) {
    var imports = filteredImports[moduleName];
    for (var i = 0; i < imports.length; i++) {
      if (identifier.referencesImport(moduleName, imports[i])) {
        return true;
      }
    }
  }

  return false;
}

module.exports.baseDir = function() { return __dirname; };
