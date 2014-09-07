module.exports = function(grunt) {
    var path = require('path');

    console.log(path.join(process.cwd(), 'tasks'));
    require('load-grunt-tasks')(grunt);
    require('load-grunt-config')(grunt, {
        configPath: path.join(process.cwd(), 'tasks')
    });

};
