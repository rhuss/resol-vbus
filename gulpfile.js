/*! resol-vbus | Copyright (c) 2013-2014, Daniel Wippermann | MIT license */
'use strict';



require('better-stack-traces').install();
var chai = require('chai');
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var Q = require('q');
global.sinon = require('sinon');



chai.Assertion.includeStack = true;

global.expect = chai.expect;



global.promiseIt = function(message, callback) {
    it(message, function(done) {
        var _this = this;

        Q.fcall(function() {
            return callback.call(_this);
        }).then(function() {
            done();
        }, function(err) {
            done(err);
        }).done();
    });
};

global.xpromiseIt = function(message, callback) {
    xit(message, function() {
        // x-ed test
    });
};



var patterns = {
    src: [
        'src/**/*.js',
    ],
    test: [
        'test/specs/**/*.spec.js',
    ],
    all: [
        'src/**/*.js',
        '!src/specification-data.js',
        'test/specs/**/*.js'
    ],
    doc: [
        'src/**/*.js',
        '!src/specification-data.js',
        'README.md',
    ],
    coverage: [
        'src/**/*.js',
        '!src/specification-data.js',
    ],
};



gulp.task('default', function() {
    return gulp.src(patterns.all)
        .pipe(plugins.jshint('.jshintrc'))
        .pipe(plugins.jshint.reporter('default'))
        .pipe(plugins.jscs())
        .on('end', function() {
            return gulp.src(patterns.test)
                .pipe(plugins.mocha({
                    ui: 'bdd',
                    reporter: 'spec',
                }));
        });
});


gulp.task('docs', function() {
    return gulp.src(patterns.doc)
        .pipe(plugins.jsdoc('./docs/jsdoc', {
            'path': 'ink-docstrap',
            'cleverLinks': false,
            'monospaceLinks': false,
            'default': {
                'outputSourceFiles': true
            },
            'systemName': 'resol-vbus',
            'footer': '',
            'copyright': 'resol-vbus | Copyright (c) 2013-2014, Daniel Wippermann',
            'navType': 'vertical',
            'theme': 'spacelab',
            'linenums': false,
            'collapseSymbols': false,
            'inverseNav': true
        }));
});


gulp.task('publish', [ 'docs' ], function() {
    return gulp.src('./docs/**/*', { base: './docs' })
        .pipe(gulp.dest('../danielwippermann.github.io/resol-vbus/docs'));
});


gulp.task('coverage', function() {
    return gulp.src(patterns.coverage)
        .pipe(plugins.istanbul())
        .on('end', function() {
            return gulp.src(patterns.test)
                .pipe(plugins.mocha({
                    ui: 'bdd',
                }))
                .pipe(plugins.istanbul.writeReports());
        });
});


gulp.task('coveralls', function() {
    return gulp.src('coverage/lcov.info')
        .pipe(plugins.coveralls());
});


gulp.task('watch', function() {
    gulp.watch(patterns.all, [ 'default' ]);
});
