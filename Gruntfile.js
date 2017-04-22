module.exports = function(grunt) {
 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        connect: {
            server: {
                port: 9001,
                base: __dirname
            }
        },

        open : {
            build: {
                path: 'http://localhost:9001'
            }
        }
    });

    grunt.loadNpmTasks('grunt-connect');
    grunt.loadNpmTasks('grunt-open');
    grunt.registerTask('serve', ['open:build', 'connect:server']);
};
