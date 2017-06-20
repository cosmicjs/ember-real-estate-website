var UNDEFINED_KEY = Object.create(null);
var HashMap = (function () {
    function HashMap(entries) {
        this._data = Object.create(null);
        if (entries) {
            for (var i = 0; i < entries.length; i++) {
                this.data[entries[i][0]] = entries[i][1];
            }
        }
    }
    HashMap.prototype.forEach = function (cb) {
        for (var key in this._data) {
            // skip undefined
            if (this._data[key] !== UNDEFINED_KEY) {
                cb(this._data[key], key);
            }
        }
        return this;
    };
    HashMap.prototype.has = function (key) {
        return key in this._data && this._data[key] !== UNDEFINED_KEY;
    };
    HashMap.prototype.get = function (key) {
        var val = this._data[key];
        return val === UNDEFINED_KEY ? undefined : val;
    };
    HashMap.prototype.set = function (key, value) {
        this._data[key] = value;
        return this;
    };
    HashMap.prototype.delete = function (key) {
        this._data[key] = UNDEFINED_KEY;
    };
    return HashMap;
}());

var SMALL_ARRAY_LENGTH = 250;
var EventArray = (function () {
    function EventArray(length, initialData) {
        if (length === void 0) { length = SMALL_ARRAY_LENGTH; }
        this.init(length, initialData);
    }
    EventArray.prototype.toJSON = function () {
        return this._data.slice(0, this.length);
    };
    EventArray.prototype.init = function (length, initialData) {
        if (length === void 0) { length = SMALL_ARRAY_LENGTH; }
        this.length = 0;
        this._length = length;
        this._data = new Array(length);
        if (initialData) {
            if (initialData.length > length) {
                length = initialData.length;
                this._data.length = length;
                this._length = length;
            }
            for (var j = 0; j < initialData.length; j++) {
                this._data[j] = initialData[j];
                this.length++;
            }
        }
    };
    // TODO this should probably multiple index by 4 to hide
    // that we store in a flat array
    EventArray.prototype.get = function (index) {
        if (index >= 0 && index < this.length) {
            return this._data.slice(index, index + 4);
        }
        return undefined;
    };
    EventArray.prototype.set = function (index, value) {
        if (index > this.length) {
            throw new Error("Index is out of array bounds.");
        }
        if (index === this.length) {
            this.length++;
        }
        this._data[index] = value;
    };
    EventArray.prototype.forEach = function (cb) {
        for (var i = 0; i < this.length; i += 4) {
            cb(this._data.slice(i, i + 4), i);
        }
    };
    EventArray.prototype.push = function (op, name, time, data) {
        var index = this.length;
        this.length += 4;
        if (index >= this._length) {
            this._length *= 2;
            this._data.length = this._length;
        }
        this._data[index] = op;
        this._data[index + 1] = name;
        this._data[index + 2] = time;
        this._data[index + 3] = data;
        return index;
    };
    EventArray.prototype.pop = function () {
        var index = --this.length;
        if (index < 0) {
            this.length = 0;
            return undefined;
        }
        return this._data[index];
    };
    return EventArray;
}());

var HAS_TYPED_ARRAYS = typeof Uint32Array !== 'undefined';
function hasTypedArrays() {
    return HAS_TYPED_ARRAYS;
}

function fill(array, value, start, end) {
    if (hasTypedArrays()) {
        return array.fill(value, start, end);
    }
    else {
        var s = start || 0;
        var e = end || array.length;
        for (; s < e; s++) {
            array[s] = value;
        }
        return array;
    }
}

function grow(array, oldLength, newLength, fillValue) {
    if (fillValue === void 0) { fillValue = 0; }
    if (hasTypedArrays()) {
        var ret = new Uint32Array(newLength);
        ret.set(array);
        if (fillValue !== 0) {
            ret.fill(fillValue, oldLength);
        }
        return ret;
    }
    else {
        array.length = newLength;
        fill(array, fillValue, oldLength, newLength);
        return array;
    }
}

var SMALL_ARRAY_LENGTH$1 = 250;
var MAX_ARRAY_LENGTH = 1e6;
var FastIntArray = (function () {
    function FastIntArray(length, initialData) {
        if (length === void 0) { length = SMALL_ARRAY_LENGTH$1; }
        this.init(length, initialData);
    }
    FastIntArray.prototype.init = function (length, initialData) {
        if (length === void 0) { length = SMALL_ARRAY_LENGTH$1; }
        var useTypedArray = hasTypedArrays();
        this.length = 0;
        this._length = length;
        this._fillValue = 0;
        this._data = useTypedArray ? new Uint32Array(length) : new Array(length);
        if (!useTypedArray) {
            fill(this._data, this._fillValue);
        }
        if (initialData) {
            if (initialData.length > length) {
                length = initialData.length;
                this.grow(length);
            }
            for (var j = 0; j < initialData.length; j++) {
                this._data[j] = initialData[j];
                this.length++;
            }
        }
    };
    FastIntArray.prototype.toJSON = function () {
        return this._data.slice(0, this.length);
    };
    FastIntArray.prototype.get = function (index) {
        if (index >= 0 && index < this.length) {
            return this._data[index];
        }
        return undefined;
    };
    FastIntArray.prototype.increment = function (index) {
        this._data[index]++;
    };
    /*
     Uint32Arrays have an immutable length. This method
     enables us to efficiently increase the length by
     any quantity.
     */
    FastIntArray.prototype.grow = function (newLength) {
        this._data = grow(this._data, this._length, newLength, this._fillValue);
        this._length = newLength;
    };
    FastIntArray.prototype.claim = function (count) {
        this.length += count;
        while (this.length > this._length) {
            this.grow(this._length * 2);
        }
    };
    FastIntArray.prototype.push = function (int) {
        var index = this.length++;
        if (index === this._length) {
            this.grow(this._length * 2);
        }
        this._data[index] = int;
    };
    return FastIntArray;
}());

var DEFAULT_STORE_SIZE = 1e3;
var DEFAULT_NAMESPACE_SIZE = 10;
/**
 * Wrapper type around options for `CounterStore`.
 *
 * Intentionally left private as `CounterStore`
 * only used internally when `HeimdallSession` is created.
 *
 * @class CounterStoreOptions
 */
var CounterStoreOptions = (function () {
    function CounterStoreOptions(storeSize, namespaceAllocation) {
        if (storeSize === void 0) { storeSize = DEFAULT_STORE_SIZE; }
        if (namespaceAllocation === void 0) { namespaceAllocation = DEFAULT_NAMESPACE_SIZE; }
        this.storeSize = storeSize;
        this.namespaceAllocation = namespaceAllocation;
    }
    return CounterStoreOptions;
}());
// NULL_NUMBER is a number larger than the largest
// index we are capable of utilizing in the store.
// if an index is this number, we know that it is null.
var NULL_NUMBER = MAX_ARRAY_LENGTH + 1;
var LOB = (1 << 16) - 1;
var CounterStore = (function () {
    function CounterStore(options) {
        if (options === void 0) { options = new CounterStoreOptions(); }
        this.options = options;
        this.initialized = false;
        this._storeInitialized = false;
        this._store = null;
        this._namespaceCount = 0;
        this._config = null;
        this._cache = null;
        this._labelCache = null;
        this._nameCache = null;
    }
    CounterStore.prototype.clean = function () {
        this._storeInitialized = false;
        this._store = null;
        this._cache = null;
    };
    CounterStore.prototype.toJSON = function () {
        return {
            _namespaceCount: this._namespaceCount,
            _config: this._config,
            _labelCache: this._labelCache,
            _nameCache: this._nameCache,
            _store: this._store
        };
    };
    CounterStore.fromJSON = function (json) {
        var store = new CounterStore();
        store._namespaceCount = json._namespaceCount;
        store._labelCache = json._labelCache;
        store._nameCache = json._nameCache;
        if (json._store) {
            store._store = new FastIntArray(json._store.length, json._store);
        }
        if (json._config) {
            store._config = new FastIntArray(json._config.length, json._config);
        }
        return store;
    };
    CounterStore.prototype.registerNamespace = function (name, labels) {
        this._initializeIfNeeded();
        var numCounters = labels.length;
        var namespaceIndex = this._namespaceCount++;
        var bitNamespaceIndex = namespaceIndex << 16;
        var namespace = Object.create(null);
        // we also generate a map between the counters
        // and these labels so that we can reconstruct
        // a meaningful structure later.
        this._nameCache[namespaceIndex] = name;
        this._labelCache[name] = labels;
        // grow the existing config and cache to account
        // for the new namespace
        this._config.push(numCounters);
        if (this._cache !== null) {
            this._cache = grow(this._cache, namespaceIndex, this._namespaceCount, NULL_NUMBER);
        }
        for (var i = 0; i < numCounters; i++) {
            namespace[labels[i]] = bitNamespaceIndex + i;
        }
        return namespace;
    };
    CounterStore.prototype._initializeIfNeeded = function () {
        if (this.initialized === false) {
            this._config = new FastIntArray(this.options.namespaceAllocation);
            this._labelCache = Object.create(null);
            this._nameCache = Object.create(null);
            this.initialized = true;
        }
    };
    CounterStore.prototype.restoreFromCache = function (cache) {
        var stats = Object.create(null);
        for (var i = 0; i < cache.length; i++) {
            if (cache[i] !== NULL_NUMBER) {
                var startIndex = cache[i];
                var namespace = this._nameCache[i];
                var counterCount = this._config.get(i);
                stats[namespace] = Object.create(null);
                for (var j = 0; j < counterCount; j++) {
                    var storeIndex = startIndex + j;
                    var label = this._labelCache[namespace][j];
                    stats[namespace][label] = this._store.get(storeIndex);
                }
            }
        }
        return stats;
    };
    CounterStore.prototype.increment = function (counter) {
        var namespaceIndex = counter >> 16;
        var counterIndex = counter & LOB;
        if (this._cache === null) {
            this._initializeStoreIfNeeded();
            var a = hasTypedArrays() ? new Uint32Array(this._namespaceCount) : new Array(this._namespaceCount);
            this._cache = fill(a, NULL_NUMBER);
        }
        if (this._cache[namespaceIndex] === NULL_NUMBER) {
            var counterCount = this._config.get(namespaceIndex);
            this._cache[namespaceIndex] = this._store.length;
            this._store.claim(counterCount);
        }
        var storeIndex = this._cache[namespaceIndex] + counterIndex;
        this._store.increment(storeIndex);
    };
    CounterStore.prototype._initializeStoreIfNeeded = function () {
        if (this._storeInitialized === false) {
            this._store = new FastIntArray(this.options.storeSize);
            this._storeInitialized = true;
        }
    };
    CounterStore.prototype.has = function (name) {
        return this._labelCache && name in this._labelCache;
    };
    CounterStore.prototype.cache = function () {
        var cache = this._cache;
        this._cache = null;
        return cache;
    };
    return CounterStore;
}());

var Session = (function () {
    function HeimdallSession() {
        this.init();
    }
    HeimdallSession.prototype.init = function () {
        this.monitors = new CounterStore();
        this.configs = new HashMap();
        this.events = new EventArray(640000 * 4);
    };
    // mostly for test helper purposes
    HeimdallSession.prototype.reset = function () {
        this.monitors.clean();
        this.events.length = 0;
    };
    return HeimdallSession;
}());

var now;
var format;
var ORIGIN_TIME;
// It turns out to be nicer for perf to bind than to close over the time method
// however, when testing we need to be able to stub the clock via the global
// so we use this boolean to determine whether we "bind" or use a wrapper function.
var freeGlobal = typeof window !== 'undefined' ? window : global;
var IS_TESTING = freeGlobal.IS_HEIMDALL_TEST_ENVIRONMENT;
if (typeof performance === 'object' && typeof performance.now === 'function') {
    now = IS_TESTING ? function now() { return performance.now(); } : performance.now.bind(performance);
    format = 'milli';
}
else if (typeof process !== 'undefined' && typeof process.hrtime === 'function') {
    now = IS_TESTING ? function now() { return process.hrtime(); } : process.hrtime.bind(process);
    format = 'hrtime';
}
else {
    ORIGIN_TIME = Date.now();
    now = Date.now.bind(Date);
    format = 'timestamp';
}
function normalizeTime(time, optionalFormat) {
    if (optionalFormat === void 0) { optionalFormat = format; }
    switch (optionalFormat) {
        case 'milli':
            return milliToNano(time);
        case 'hrtime':
            return timeFromHRTime(time);
        case 'timestamp':
            return milliToNano(time - ORIGIN_TIME);
        default:
            throw new Error('Unknown Format');
    }
}
function milliToNano(time) {
    return Math.floor(time * 1e6);
}
function timeFromHRTime(hrtime) {
    return hrtime[0] * 1e9 + hrtime[1];
}
var now$1 = now;

var OpCodes;
(function (OpCodes) {
    OpCodes[OpCodes["OP_START"] = 0] = "OP_START";
    OpCodes[OpCodes["OP_STOP"] = 1] = "OP_STOP";
    OpCodes[OpCodes["OP_RESUME"] = 2] = "OP_RESUME";
    OpCodes[OpCodes["OP_ANNOTATE"] = 3] = "OP_ANNOTATE";
})(OpCodes || (OpCodes = {}));
var OpCodes$1 = OpCodes;

var VERSION = '0.3.3';
var Heimdall = (function () {
    function Heimdall(session) {
        if (arguments.length < 1) {
            this._session = new Session();
            this.start('session-root');
        }
        else {
            this._session = session;
        }
    }
    Object.defineProperty(Heimdall, "VERSION", {
        get: function () {
            return VERSION;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Heimdall.prototype, "VERSION", {
        get: function () {
            return VERSION;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Heimdall.prototype, "_monitors", {
        get: function () {
            return this._session.monitors;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Heimdall.prototype, "_events", {
        get: function () {
            return this._session.events;
        },
        enumerable: true,
        configurable: true
    });
    Heimdall.prototype._retrieveCounters = function () {
        return this._monitors.cache();
    };
    Heimdall.prototype.start = function (name) {
        return this._session.events.push(OpCodes$1.OP_START, name, now$1(), this._retrieveCounters());
    };
    Heimdall.prototype.stop = function (token) {
        this._session.events.push(OpCodes$1.OP_STOP, token, now$1(), this._retrieveCounters());
    };
    Heimdall.prototype.resume = function (token) {
        this._session.events.push(OpCodes$1.OP_RESUME, token, now$1(), this._retrieveCounters());
    };
    Heimdall.prototype.annotate = function (info) {
        // This has the side effect of making events heterogenous, as info is an object
        // while counters will always be `null` or an `Array`
        this._session.events.push(OpCodes$1.OP_ANNOTATE, NULL_NUMBER, NULL_NUMBER, info);
    };
    Heimdall.prototype.hasMonitor = function (name) {
        return !!this._monitors.has(name);
    };
    Heimdall.prototype.registerMonitor = function (name) {
        var keys = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            keys[_i - 1] = arguments[_i];
        }
        if (name === 'own' || name === 'time') {
            throw new Error('Cannot register monitor at namespace "' + name + '".  "own" and "time" are reserved');
        }
        if (this.hasMonitor(name)) {
            throw new Error('A monitor for "' + name + '" is already registered"');
        }
        return this._monitors.registerNamespace(name, keys);
    };
    Heimdall.prototype.increment = function (token) {
        this._session.monitors.increment(token);
    };
    Heimdall.prototype.configFor = function (name) {
        var config = this._session.configs.get(name);
        if (!config) {
            config = Object.create(null);
            this._session.configs.set(name, config);
        }
        return config;
    };
    /*
      Ideally, this method should only be used for serializing
      session data for transfer. Heimdall-tree can load time
      data from this format or out of `getSessionData`.
     */
    Heimdall.prototype.toJSON = function () {
        return {
            heimdallVersion: VERSION,
            format,
            monitors: this._monitors.toJSON(),
            events: this._events.toJSON(),
            serializationTime: now$1()
        };
    };
    Heimdall.prototype.toString = function () {
        return JSON.stringify(this.toJSON());
    };
    return Heimdall;
}());

var HeimdallNode = (function () {
    function HeimdallNode(name, id) {
        this._id = id;
        this.parent = null;
        this.resumeNode = null;
        this.name = name;
        this.stopped = false;
        this.leaves = [];
        this.nodes = [];
        this.children = [];
    }
    Object.defineProperty(HeimdallNode.prototype, "stats", {
        get: function () {
            var own = {
                selfTime: 0,
                duration: 0,
                startTime: this.leaves[0].startTime,
                endTime: this.leaves[this.leaves.length - 1].endTime
            };
            own.duration = own.endTime - own.startTime;
            var counters = [];
            var annotations = [];
            var stats = {
                self: own
            };
            this.forEachLeaf(function (leaf) {
                own.selfTime += leaf.selfTime;
                annotations.push(leaf.annotations);
                for (var namespace in leaf.counters) {
                    var value = leaf.counters[namespace];
                    if (!stats.hasOwnProperty(namespace)) {
                        stats[namespace] = value;
                    }
                    else {
                        for (var label in value) {
                            stats[namespace][label] += value[label];
                        }
                    }
                }
                counters.push(leaf.counters);
            });
            return stats;
        },
        enumerable: true,
        configurable: true
    });
    HeimdallNode.prototype.stop = function () {
        if (this.stopped === true) {
            throw new Error('Cannot Stop node, already stopped!');
        }
        this.stopped = true;
    };
    HeimdallNode.prototype.resume = function (resumeNode) {
        if (!this.stopped) {
            throw new Error('Cannot Resume node, already running!');
        }
        this.resumeNode = resumeNode;
        this.stopped = false;
    };
    HeimdallNode.prototype.addLeaf = function (leaf) {
        leaf.owner = this;
        this.leaves.push(leaf);
        this.children.push(leaf);
    };
    HeimdallNode.prototype.addNode = function (node) {
        if (node.parent) {
            throw new Error("Cannot set parent of node '" + node.name + "', node already has a parent!");
        }
        node.parent = this;
        node.resumeNode = this;
        this.nodes.push(node);
        this.children.push(node);
    };
    Object.defineProperty(HeimdallNode.prototype, "isRoot", {
        get: function () {
            return this.parent === null;
        },
        enumerable: true,
        configurable: true
    });
    HeimdallNode.prototype.visitPreOrder = function (cb) {
        cb(this);
        for (var i = 0; i < this.nodes.length; i++) {
            this.nodes[i].visitPreOrder(cb);
        }
    };
    HeimdallNode.prototype.visitPostOrder = function (cb) {
        for (var i = 0; i < this.nodes.length; i++) {
            this.nodes[i].visitPostOrder(cb);
        }
        cb(this);
    };
    HeimdallNode.prototype.forEachNode = function (cb) {
        for (var i = 0; i < this.nodes.length; ++i) {
            cb(this.nodes[i]);
        }
    };
    HeimdallNode.prototype.forEachLeaf = function (cb) {
        for (var i = 0; i < this.leaves.length; ++i) {
            cb(this.leaves[i]);
        }
    };
    HeimdallNode.prototype.forEachChild = function (cb) {
        for (var i = 0; i < this.children.length; ++i) {
            cb(this.children[i]);
        }
    };
    HeimdallNode.prototype.toJSON = function () {
        return {
            _id: this._id,
            name: this.name,
            leaves: this.leaves.map(function (leaf) { return leaf.toJSON(); }),
            nodes: this.nodes.map(function (child) { return child._id; }),
            children: this.children.map(function (child) { return child._id; })
        };
    };
    HeimdallNode.prototype.toJSONSubgraph = function () {
        var nodes = [];
        this.visitPreOrder(function (node) { return nodes.push(node.toJSON()); });
        return nodes;
    };
    return HeimdallNode;
}());

var HeimdallLeaf = (function () {
    function HeimdallLeaf() {
        // set on start
        this._id = null;
        this.owner = null;
        this.previousOp = null;
        this.startTime = 0;
        // set on annotate
        this.annotations = null;
        // set on stop
        this.nextOp = null;
        this.endTime = 0;
        this.counters = null;
        this.name = null;
    }
    Object.defineProperty(HeimdallLeaf.prototype, "selfTime", {
        get: function () {
            return this.endTime - this.startTime;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HeimdallLeaf.prototype, "isStopped", {
        get: function () {
            return this.endTime !== 0;
        },
        enumerable: true,
        configurable: true
    });
    HeimdallLeaf.prototype.annotate = function (annotation) {
        if (this.annotations === null) {
            this.annotations = [];
        }
        this.annotations.push(annotation);
    };
    HeimdallLeaf.prototype.start = function (owner, previousOp, time) {
        this.owner = owner;
        this.previousOp = previousOp;
        this.startTime = time;
    };
    HeimdallLeaf.prototype.stop = function (nextOp, time, counters) {
        this.nextOp = nextOp;
        this.endTime = time;
        this.counters = counters;
        this._id = this.name = "[" + this.owner.name + "]#" + this.previousOp + ":" + nextOp;
    };
    HeimdallLeaf.prototype.toJSON = function () {
        return {
            _id: this._id,
            name: this.name,
            startTime: this.startTime,
            endTime: this.endTime,
            counters: this.counters,
            annotations: this.annotations
        };
    };
    return HeimdallLeaf;
}());

/*
Example Event Timeline and tree reconstruction

As       Bs       Cs       Ce       Be       Ae
|--------|--------|--------|--------|--------|
   AB        BC       CC      CB        BA

Tree
A
 \
  B
   \
    C

Leafy Tree
A <- node
 |_AB <- leaf
 |_ B <- child node
 | |_ BC
 | |
 | |_C
 | | |_ CC
 | |
 | |_ CB
 |
 |_ BA

*/
function statsFromCounters(counterStore, counterCache) {
    if (!counterStore || !counterCache) {
        return null;
    }
    return counterStore.restoreFromCache(counterCache);
}
var HeimdallTree = (function () {
    function HeimdallTree(heimdall, lastKnownTime) {
        this._heimdall = heimdall;
        this.root = null;
        this.format = heimdall && heimdall._timeFormat ? heimdall._timeFormat : format;
        this.lastKnownTime = lastKnownTime;
    }
    HeimdallTree.fromJSON = function (json) {
        var events = json.events || [];
        var heimdall = {
            _timeFormat: json.format || format,
            _events: new EventArray(events.length, events),
            _monitors: CounterStore.fromJSON(json.monitors)
        };
        return new HeimdallTree(heimdall, json.serializationTime);
    };
    Object.defineProperty(HeimdallTree.prototype, "path", {
        // primarily a test helper, you can get this at any time
        // to get an array representing the path of open node names
        // from "root" to the last open node.
        get: function () {
            var events = this._heimdall._events;
            var root = new HeimdallNode('root', 1e9);
            var currentNode = root;
            var nodeMap = new HashMap();
            var node;
            var top;
            var path = [];
            events.forEach(function (_a, i) {
                var op = _a[0], name = _a[1];
                switch (op) {
                    case OpCodes$1.OP_START:
                        node = new HeimdallNode(name, i);
                        nodeMap.set(i, node);
                        currentNode.addNode(node);
                        currentNode = node;
                        break;
                    case OpCodes$1.OP_STOP:
                        node = nodeMap.get(name);
                        if (name !== currentNode._id) {
                            // potentially throw the correct error (already stopped)
                            if (node) {
                                node.stop();
                            }
                            else {
                                throw new Error("Cannot Stop, Attempting to stop a non-existent node!");
                            }
                            throw new Error("Cannot Stop, Attempting to stop a node with an active child!");
                        }
                        currentNode.stop();
                        currentNode = currentNode.resumeNode;
                        break;
                    case OpCodes$1.OP_RESUME:
                        node = nodeMap.get(name);
                        node.resume(currentNode);
                        currentNode = node;
                        break;
                    default:
                        throw new Error("HeimdallTree encountered an unknown OpCode '" + op + "' during path construction.");
                }
            });
            top = currentNode;
            while (top !== undefined && top !== root) {
                path.unshift(top.name);
                top = top.parent;
            }
            return path;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HeimdallTree.prototype, "stack", {
        // primarily a test helper, you can get this at any time
        // to get an array representing the "stack" of open node names.
        get: function () {
            var events = this._heimdall._events;
            var stack = [];
            var nodeMap = new HashMap();
            events.forEach(function (_a, i) {
                var op = _a[0], name = _a[1];
                if (op === OpCodes$1.OP_START) {
                    stack.push(name);
                    nodeMap.set(i, name);
                }
                else if (op === OpCodes$1.OP_RESUME) {
                    var n = nodeMap.get(name);
                    stack.push(n);
                }
                else if (op === OpCodes$1.OP_STOP) {
                    var n = nodeMap.get(name);
                    if (n !== stack[stack.length - 1]) {
                        throw new Error('Invalid Stack!');
                    }
                    stack.pop();
                }
            });
            return stack;
        },
        enumerable: true,
        configurable: true
    });
    HeimdallTree.prototype._createLeaf = function (currentNode, time) {
        var leaf = new HeimdallLeaf();
        leaf.start(currentNode, currentNode.name, time);
        currentNode.addLeaf(leaf);
        return leaf;
    };
    HeimdallTree.prototype._chainLeaf = function (currentNode, incomingNode, time) {
        var leaf = new HeimdallLeaf();
        leaf.start(currentNode, incomingNode.name, time);
        currentNode.addLeaf(leaf);
        return leaf;
    };
    HeimdallTree.prototype._createNode = function (nodeName, index, nodeMap) {
        var node = new HeimdallNode(nodeName, index);
        nodeMap.set(index, node);
        return node;
    };
    HeimdallTree.prototype._chainNode = function (currentNode, nodeName, index, nodeMap) {
        var node = this._createNode(nodeName, index, nodeMap);
        currentNode.addNode(node);
        return node;
    };
    HeimdallTree.prototype.construct = function () {
        var _this = this;
        var events = this._heimdall._events;
        var currentLeaf = null;
        var currentNode = null;
        var nodeMap = new HashMap();
        var openNodes = [];
        var node;
        var format = this.format;
        var counterStore = this._heimdall._monitors;
        var stopTime = this.lastKnownTime ? normalizeTime(this.lastKnownTime) : now$1();
        var pageRootIndex = events._length + 1;
        currentNode = this.root = this._createNode('page-root', pageRootIndex, nodeMap);
        currentLeaf = this._createLeaf(currentNode, 0);
        openNodes.push(node);
        events.forEach(function (_a, i) {
            var op = _a[0], name = _a[1], time = _a[2], counters = _a[3];
            if (op !== OpCodes$1.OP_ANNOTATE) {
                time = normalizeTime(time, format);
                counters = statsFromCounters(counterStore, counters);
            }
            switch (op) {
                case OpCodes$1.OP_START:
                    currentNode = _this._chainNode(currentNode, name, i, nodeMap);
                    openNodes.push(currentNode);
                    if (currentLeaf) {
                        currentLeaf.stop(name, time, counters);
                    }
                    currentLeaf = _this._createLeaf(currentNode, time);
                    break;
                case OpCodes$1.OP_STOP:
                    node = nodeMap.get(name);
                    if (name !== currentNode._id) {
                        // potentially throw the correct error (already stopped)
                        if (node) {
                            node.stop();
                        }
                        else {
                            throw new Error("Cannot Stop, Attempting to stop a non-existent node!");
                        }
                        throw new Error("Cannot Stop, Attempting to stop a node with an active child!");
                    }
                    currentNode.stop();
                    openNodes.splice(openNodes.indexOf(currentNode), 1);
                    currentNode = currentNode.resumeNode;
                    currentLeaf.stop(node.name, time, counters);
                    currentLeaf = _this._chainLeaf(currentNode, node, time);
                    break;
                case OpCodes$1.OP_RESUME:
                    node = nodeMap.get(name);
                    node.resume(currentNode);
                    currentNode = node;
                    openNodes.push(node);
                    if (currentLeaf) {
                        currentLeaf.stop(node.name, time, counters);
                    }
                    currentLeaf = _this._chainLeaf(currentNode, node, time);
                    break;
                case OpCodes$1.OP_ANNOTATE:
                    currentLeaf.annotate(counters);
                    break;
                default:
                    throw new Error("HeimdallTree encountered an unknown OpCode '" + op + "' during tree construction.");
            }
        });
        while (currentNode && !currentNode.stopped) {
            var name = currentNode.name;
            var node_1 = currentNode;
            currentNode.stop();
            currentNode = currentNode.resumeNode;
            currentLeaf.stop(node_1.name, stopTime, null);
            if (currentNode) {
                currentLeaf = this._chainLeaf(currentNode, node_1, stopTime);
            }
        }
    };
    HeimdallTree.prototype.toJSON = function () {
        if (!this.root) {
            this.construct();
        }
        return {
            heimdallVersion: '0.3.3',
            nodes: this.root.toJSONSubgraph()
        };
    };
    HeimdallTree.prototype.visitPreOrder = function (cb) {
        this.root.visitPreOrder(cb);
    };
    HeimdallTree.prototype.visitPostOrder = function (cb) {
        this.root.visitPostOrder(cb);
    };
    return HeimdallTree;
}());

function setupSession(global) {
    // The name of the property encodes the session/node compatibilty version
    if (!global._heimdall_session_3) {
        global._heimdall_session_3 = new Session();
    }
}

setupSession(process);
var defaultHeimdall = new Heimdall(process._heimdall_session_3);
defaultHeimdall.now = now$1;
defaultHeimdall.Heimdall = Heimdall;
defaultHeimdall.Session = Session;
defaultHeimdall._Tree = HeimdallTree;
defaultHeimdall._Node = HeimdallNode;

module.exports = defaultHeimdall;