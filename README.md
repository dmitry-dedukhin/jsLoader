Async JS loader
===============

Helps to organize your code in modules and load them asynchronously.

Some examples goes here.

Execute code after modules `test1` and `test2` load:
----------------------------------------------------

    jsLoader.require('test1', 'test2', function() {
        log('EXECUTED: inline script waiting for test1 && test2');
    });

Execute code after domready event and module `test2` load:
----------------------------------------------------------

    jsLoader.require('domready', 'test2', function() {
        log('EXECUTED: inline script waiting for domready && test2');
    });

Execute code after domready event:
----------------------------------
    jsLoader.domready(function() { // or jsLoader.require('domready', function() {
        log('DOM ready');
    });

Preload script:
---------------

    jsLoader.load(['test3']);


See [Wiki][1] for complete example.

[a1]: https://github.com/dmitry-dedukhin/jsLoader/wiki
