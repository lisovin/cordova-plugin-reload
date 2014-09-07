module.exports = {
    compile: {
        options: {
            baseUrl: '../src',
            optimize: 'none',
            include: 'loader',
            out: 'build/<%= package.name %>.js',
            onModuleBundleComplete: function (data) {
                var fs = require('fs'),
                amdclean = require('amdclean'),
                outputFile = data.path;

                fs.writeFileSync(outputFile, amdclean.clean({
                    'filePath': outputFile
                }));
            }
        }
    }
};
