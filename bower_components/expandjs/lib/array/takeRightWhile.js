/*jslint browser: true, devel: true, node: true, ass: true, nomen: true, unparam: true, indent: 4 */

/**
 * @license
 * Copyright (c) 2015 The ExpandJS authors. All rights reserved.
 * This code may only be used under the BSD style license found at https://expandjs.github.io/LICENSE.txt
 * The complete set of authors may be found at https://expandjs.github.io/AUTHORS.txt
 * The complete set of contributors may be found at https://expandjs.github.io/CONTRIBUTORS.txt
 */
(function () {
    "use strict";

    var _              = require('lodash'),
        assertArgument = require('../assert/assertArgument'),
        isPredicate    = require('../tester/isPredicate'),
        toArray        = require('../caster/toArray');

    /**
     * Creates a slice of `array` with elements taken from the end.
     * Elements are taken until `predicate` returns falsey.
     * The predicate is bound to `thisArg` and invoked with three arguments; (value, index, array).
     *
     * ```js
     * XP.takeRightWhile([1, 2, 3], function(n) { return n > 1; });
     * // => [2, 3]
     *
     * var users = [
     *     {user: 'barney', active: true},
     *     {user: 'fred', active: false},
     *     {user: 'pebbles', active: false}
     * ];
     *
     * XP.takeRightWhile(users, {user: 'pebbles', active: false});
     * // => [{user: 'pebbles', active: false}]
     *
     * XP.takeRightWhile(users, 'active', false);
     * // => [{user: 'fred', active: false}, {user: 'pebbles', active: false}]
     * ```
     *
     * @function takeRightWhile
     * @param {Array} array The array to query.
     * @param {Function | Object | string} predicate The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the slice of `array`.
     */
    module.exports = function takeRightWhile(array, predicate, thisArg) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        assertArgument(isPredicate(predicate), 2, 'Function, Object or string');
        return _.takeRightWhile(array, predicate, thisArg);
    };

}());
