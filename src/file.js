define(['async'], function (async) {
    'use strict';

    var continuation = async.continuation,
        continuable = async.continuable,
        future = async.future;

    function requestQuota(size) {
        return function (onSuccess, onError) {
            navigator.webkitPersistentStorage.requestQuota(size, onSuccess, onError);
        };
    }

    function requestFileSystem(storageType, size, onResult) {
        var _requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

        return function (onSuccess, onError) {
            _requestFileSystem(storageType, size, function (fs) {
                onResult(fs);
                onSuccess();
            }, onError);
        };
    }

    function getFile(fs, filename, options, onResult) {
        return function (onSuccess, onError) {
            fs.then(function (fs) {
                fs.root.getFile(filename, options, function (fileEntry) {
                    onResult(fileEntry);
                    onSuccess();
                }, onError);
            });
        };
    }

    function removeFile(fileEntry) {
        return function (onSuccess, onError) {
            fileEntry.then(function (fileEntry) {
                fileEntry.remove(onSuccess, onError);
            });
        };
    }

    function createWriter(fileEntry, onResult) {
        return function (onSuccess, onError) {
            fileEntry.then(function (fileEntry) {
                fileEntry.createWriter(function (writer) {
                    onResult(writer);
                    onSuccess();
                }, onError);
            });
        };
    }

    function write(writer, text) {
        return function (onSuccess, onError) {
            writer.then(function (writer) {
                var blob = new Blob([typeof text === 'function' ? text() : text]);
                writer.onwriteend = onSuccess;
                writer.onerror = onError;

                writer.write(blob);
            });
        };
    }

    function writeTextToFile(fs, filename, text) {
        var fileEntry = future(),
            writer = future();

        return continuation(
            getFile(fs, filename, { create: true, exlusive: true }, fileEntry),
            removeFile(fileEntry),
            getFile(fs, filename, { create: true, exlusive: true }, fileEntry),
            createWriter(fileEntry, writer),
            write(writer, text),
            continuable(function () {
                var js = document.createElement('script');
                js.src = 'filesystem:http://192.168.2.118:8888/persistent/compass-1.0.0.js';
                //js.text = appSource();
                document.getElementsByTagName('head').item(0).appendChild(js);
            })
        );
    }

    return {
        requestQuota: requestQuota,
        requestFileSystem: requestFileSystem,
        getFile: getFile,
        removeFile: removeFile,
        createWriter: createWriter,
        write: write,
        writeTextToFile: writeTextToFile
    };
});

