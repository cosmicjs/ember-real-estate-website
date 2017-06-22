define('ember-wormhole/components/ember-wormhole', ['exports', 'ember', 'ember-wormhole/templates/components/ember-wormhole', 'ember-wormhole/utils/dom'], function (exports, _ember, _emberWormholeTemplatesComponentsEmberWormhole, _emberWormholeUtilsDom) {
  var Component = _ember['default'].Component;
  var computed = _ember['default'].computed;
  var observer = _ember['default'].observer;
  var run = _ember['default'].run;
  exports['default'] = Component.extend({
    layout: _emberWormholeTemplatesComponentsEmberWormhole['default'],

    /*
     * Attrs
     */
    to: computed.alias('destinationElementId'),
    destinationElementId: null,
    destinationElement: computed('destinationElementId', 'renderInPlace', function () {
      var renderInPlace = this.get('renderInPlace');
      if (renderInPlace) {
        return this._element;
      }
      var id = this.get('destinationElementId');
      if (!id) {
        return null;
      }
      return (0, _emberWormholeUtilsDom.findElementById)(this._dom.document, id);
    }),
    renderInPlace: false,

    /*
     * Lifecycle
     */
    init: function init() {
      this._super.apply(this, arguments);

      this._dom = (0, _emberWormholeUtilsDom.getDOM)(this);

      // Create text nodes used for the head, tail
      this._wormholeHeadNode = this._dom.document.createTextNode('');
      this._wormholeTailNode = this._dom.document.createTextNode('');

      // A prop to help in the mocking of didInsertElement timing for Fastboot
      this._didInsert = false;
    },

    /*
     * didInsertElement does not fire in Fastboot. Here we use willRender and
     * a _didInsert property to approximate the timing. Importantly we want
     * to run appendToDestination after the child nodes have rendered.
     */
    willRender: function willRender() {
      var _this = this;

      this._super.apply(this, arguments);
      if (!this._didInsert) {
        this._didInsert = true;
        run.schedule('afterRender', function () {
          if (_this.isDestroyed) {
            return;
          }
          _this._element = _this._wormholeHeadNode.parentNode;
          if (!_this._element) {
            throw new Error('The head node of a wormhole must be attached to the DOM');
          }
          _this._appendToDestination();
        });
      }
    },

    willDestroyElement: function willDestroyElement() {
      var _this2 = this;

      // not called in fastboot
      this._super.apply(this, arguments);
      this._didInsert = false;
      var _wormholeHeadNode = this._wormholeHeadNode;
      var _wormholeTailNode = this._wormholeTailNode;

      run.schedule('render', function () {
        _this2._removeRange(_wormholeHeadNode, _wormholeTailNode);
      });
    },

    _destinationDidChange: observer('destinationElement', function () {
      var destinationElement = this.get('destinationElement');
      if (destinationElement !== this._wormholeHeadNode.parentNode) {
        run.schedule('render', this, '_appendToDestination');
      }
    }),

    _appendToDestination: function _appendToDestination() {
      var destinationElement = this.get('destinationElement');
      if (!destinationElement) {
        var destinationElementId = this.get('destinationElementId');
        if (destinationElementId) {
          throw new Error('ember-wormhole failed to render into \'#' + this.get('destinationElementId') + '\' because the element is not in the DOM');
        }
        throw new Error('ember-wormhole failed to render content because the destinationElementId was set to an undefined or falsy value.');
      }

      var currentActiveElement = (0, _emberWormholeUtilsDom.getActiveElement)();
      this._appendRange(destinationElement, this._wormholeHeadNode, this._wormholeTailNode);
      if (currentActiveElement && (0, _emberWormholeUtilsDom.getActiveElement)() !== currentActiveElement) {
        currentActiveElement.focus();
      }
    },

    _appendRange: function _appendRange(destinationElement, firstNode, lastNode) {
      while (firstNode) {
        destinationElement.insertBefore(firstNode, null);
        firstNode = firstNode !== lastNode ? lastNode.parentNode.firstChild : null;
      }
    },

    _removeRange: function _removeRange(firstNode, lastNode) {
      var node = lastNode;
      do {
        var next = node.previousSibling;
        if (node.parentNode) {
          node.parentNode.removeChild(node);
          if (node === firstNode) {
            break;
          }
        }
        node = next;
      } while (node);
    }

  });
});