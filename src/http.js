define(function () {
    'use strict';

    function get(url, onResult) {

        return function (onSuccess, onError) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.onreadystatechange = function () {
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        onResult(xhr.responseText);
                        onSuccess();
                    } else {
                        onError(xhr);
                    }
                }
            };
            xhr.send();
        };
    }

    return {
        get: get
    };
});


