define('ember-wormhole/utils/dom', ['exports'], function (exports) {
  exports.getActiveElement = getActiveElement;
  exports.findElementById = findElementById;
  exports.getDOM = getDOM;
  /*
   * Implement some helpers methods for interacting with the DOM,
   * be it Fastboot's SimpleDOM or the browser's version.
   */

  function getActiveElement() {
    if (typeof document === 'undefined') {
      return null;
    } else {
      return document.activeElement;
    }
  }

  function childNodesOfElement(element) {
    var children = [];
    var child = element.firstChild;
    while (child) {
      children.push(child);
      child = child.nextSibling;
    }
    return children;
  }

  function findElementById(doc, id) {
    if (doc.getElementById) {
      return doc.getElementById(id);
    }

    var nodes = childNodesOfElement(doc);
    var node = undefined;

    while (nodes.length) {
      node = nodes.shift();

      if (node.getAttribute && node.getAttribute('id') === id) {
        return node;
      }

      nodes = childNodesOfElement(node).concat(nodes);
    }
  }

  // Private Ember API usage. Get the dom implementation used by the current
  // renderer, be it native browser DOM or Fastboot SimpleDOM

  function getDOM(context) {
    var renderer = context.renderer;

    if (renderer._dom) {
      // pre glimmer2
      return renderer._dom;
    } else if (renderer._env && renderer._env.getDOM) {
      // glimmer2
      return renderer._env.getDOM();
    } else {
      throw new Error('ember-wormhole could not get DOM');
    }
  }
});