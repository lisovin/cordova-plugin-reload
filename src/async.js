define(function () {
    'use strict';

    function continuation () {
        var ops = Array.prototype.slice.apply(arguments);

        function bind(operations, onSuccess, onError) {
            var op = operations.shift();

            if (!op) {
                onSuccess();
                return;
            }

            op(function () {
                bind(operations, onSuccess, onError);
            }, onError);
        }

        return function (onSuccess, onError) {
            bind(ops, onSuccess, onError);
        };
    }

    function continuable(f) {
        return function (onSuccess, onError) {
            var rest = f();
            if (rest) {
                rest(onSuccess, onError);
            } else {
                onSuccess();
            }
        };
    }

    function future() {
        var value,
            thenable,
            isSet,
            r;

        r = function(newValue) {
            if (arguments.length === 0) {
                return value;
            }

            //console.log(name + ': ' + value + ' <- ' + newValue);
            value = newValue;
            isSet = true;
            if (thenable) {
                thenable(newValue);
            }
        };

        r.then = function (newThenable) {
            if (thenable) {
                throw new Error('`then` should be called only once on the future.');
            }

            if (isSet) {
                newThenable(value);
            } else {
                thenable = newThenable;
            }
        };

        return r;
    }

    return {
        continuation: continuation,
        continuable: continuable,
        future: future
    };
});
