require([
    'async',
    'http',
    'file'
], function loader(async, http, file) {
    'use strict';

    var // imports
        httpGet = http.get,
        requestQuota = file.requestQuota,
        requestFileSystem = file.requestFileSystem,
        writeTextToFile = file.writeTextToFile,
        continuable = async.continuable,
        continuation = async.continuation,
        future = async.future,
        // vars
        fs = future(),
        currentVersion,
        version = future(),
        appSource = future(),
        load;

    load = continuation(
        //);LocalFileSystem.PERSISTENT)
        requestQuota(1024 * 1024),
        requestFileSystem(window.PERSISTENT, 1024, fs),
        httpGet('http://192.168.2.118:8888/version.txt', version),
        continuable(function () {
            var url;
            if (currentVersion === version()) { return;}

            console.log('--->updating the app from ' + currentVersion + ' to ' + version());
            url = 'http://192.168.2.118:8888/js/Compass-' + version() + '.js';
            return continuation(
                httpGet(url, appSource),
                writeTextToFile(fs, 'compass-' + version() + '.js', appSource)
            );
        })
    );

    load(function () {
        console.log('finished running script');
    }, function (err) {
        console.log('failed to run script', err);
    });
});
