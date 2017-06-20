module.exports = EmberBuildConfigEditor;

var recast = require('recast');
var builders = recast.types.builders;

function EmberBuildConfigEditor(source, ast) {
  this.source = source;
  this.ast = this.parse(ast);
  this.configNode = null;

  this.findConfigNode(this.ast);
}

EmberBuildConfigEditor.prototype.parse = function (ast) {
  return ast || recast.parse(this.source);
};

function isObjectExpression(element) {
  return element.type === 'ObjectExpression';
}

function findInlineConfigNode(ast) {
  var configNode;

  recast.visit(ast, {
    visitNewExpression: function (path) {
      var node = path.node;

      if (node.callee.name === 'EmberApp'
          || node.callee.name === 'EmberAddon') {
        configNode = node.arguments.find(isObjectExpression);

        return false;
      } else {
        this.traverse(path);
      }
    }
  });

  return configNode;
}

function identifierBinding(scope, configIdentifier) {
  return scope.bindings[configIdentifier.name][0];
}
function bindingInitializer(binding) {
  var variableDeclaration = binding.parentPath;
  return variableDeclaration.value.init;
}
function findSeparateConfigNode(ast) {
  var configIdentifier;
  var configPath;

  recast.visit(ast, {
    visitNewExpression: function(path) {
      var node = path.node;

      if (node.callee.name === 'EmberApp') {
        configIdentifier = node.arguments[1];
        configPath = path;

        return false;
      } else {
        this.traverse(path);
      }
    }
  });

  if (configPath) {
    var scope = configPath.scope;
    if (configIdentifier && scope.declares(configIdentifier.name)) {
      var binding = identifierBinding(scope, configIdentifier);
      return bindingInitializer(binding);
    }
  }
}

EmberBuildConfigEditor.prototype.findConfigNode = function (ast) {
  var configNode = findInlineConfigNode(ast);

  if (!configNode) {
    configNode = findSeparateConfigNode(ast);
  }

  this.configNode = configNode;
};

EmberBuildConfigEditor.prototype.clone = function () {
  return new EmberBuildConfigEditor(this.code());
};

function isKey(key) {
  return function (property) {
    return (property.key.type === 'Literal' && property.key.value === key)
      || (property.key.type === 'Identifier' && property.key.name === key);
  };
}

function findOrAddConfigKey(key) {
  var configKey = this.configNode.properties.find(isKey(key));

  if (!configKey) {
    configKey = builders.property(
      'init',
      builders.literal(key),
      builders.objectExpression([])
    );

    this.configNode.properties.push(configKey);
  }

  return configKey;
}

function addOrUpdateConfigProperty(configObject, property, config) {
  var existingProperty = configObject.properties.find(isKey(property));

  if (existingProperty) {
    existingProperty.value.value = config[property];
  } else {
    var newProperty = builders.property(
      'init',
      builders.literal(property),
      builders.literal(config[property])
    );
    configObject.properties.push(newProperty);
  }
}

function addOrUpdateConfigProperties(configKey, config) {
  var configObject = configKey.value;

  for (var property in config) {
    addOrUpdateConfigProperty(configObject, property, config);
  }
}

EmberBuildConfigEditor.prototype.edit = function (key, config) {
  if (!key || !config) {
    return this.clone();
  }

  if (!this.configNode) {
    throw new Error('Configuration object could not be found');
  }

  var configKey = findOrAddConfigKey.call(this, key);
  addOrUpdateConfigProperties(configKey, config);

  return this;
};

EmberBuildConfigEditor.prototype.code = function (options) {
  var printOptions = options || {tabWidth: 2, quote: 'single'};

  return recast.print(this.ast, printOptions).code;
};

EmberBuildConfigEditor.prototype.retrieve = function (key) {
  if (!this.configNode) {
    return undefined;
  }

  var configKey = this.configNode.properties.find(isKey(key));

  if (!configKey) {
    return undefined;
  }

  var config = {};

  configKey.value.properties.forEach(function (property) {
    var key;
    if (property.key.type === 'Literal') {
      key = property.key.value;
    } else { // Assuming 'Identifier'
      key = property.key.name;
    }
    config[key] = property.value.value;
  });

  return config;
};
