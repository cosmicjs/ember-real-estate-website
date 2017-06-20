define("ember-data/-private/system/diff-array", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = diffArray;
  /**
    @namespace
    @method diff-array
    @for DS
    @param {Array} oldArray the old array
    @param {Array} newArray the new array
    @return {hash} {
        firstChangeIndex: <integer>,  // null if no change
        addedCount: <integer>,        // 0 if no change
        removedCount: <integer>       // 0 if no change
      }
  */
  function diffArray(oldArray, newArray) {
    var oldLength = oldArray.length;
    var newLength = newArray.length;

    var shortestLength = Math.min(oldLength, newLength);
    var firstChangeIndex = null; // null signifies no changes

    // find the first change
    for (var i = 0; i < shortestLength; i++) {
      // compare each item in the array
      if (oldArray[i] !== newArray[i]) {
        firstChangeIndex = i;
        break;
      }
    }

    if (firstChangeIndex === null && newLength !== oldLength) {
      // no change found in the overlapping block
      // and array lengths differ,
      // so change starts at end of overlap
      firstChangeIndex = shortestLength;
    }

    var addedCount = 0;
    var removedCount = 0;
    if (firstChangeIndex !== null) {
      // we found a change, find the end of the change
      var unchangedEndBlockLength = shortestLength - firstChangeIndex;
      // walk back from the end of both arrays until we find a change
      for (var _i = 1; _i <= shortestLength; _i++) {
        // compare each item in the array
        if (oldArray[oldLength - _i] !== newArray[newLength - _i]) {
          unchangedEndBlockLength = _i - 1;
          break;
        }
      }
      addedCount = newLength - unchangedEndBlockLength - firstChangeIndex;
      removedCount = oldLength - unchangedEndBlockLength - firstChangeIndex;
    }

    return {
      firstChangeIndex: firstChangeIndex,
      addedCount: addedCount,
      removedCount: removedCount
    };
  }
});