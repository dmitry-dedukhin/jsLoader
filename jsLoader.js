(function() {
var DOMREADY = 'domready',
	doc = document,
	wnd = window,
	jsLoader = wnd.jsLoader = {
		scripts: {},
		callbacks: [],
		map: {},
		load: function(aliases) {
			for(var i=0, name; name=aliases[i++];) {
				var url = this.map[name];
				if(typeof name == 'undefined' || name == DOMREADY || typeof this.scripts[name] != 'undefined')
					continue;
				this.scripts[name] = {url: url, loaded: false};
				(function(url) {
					setTimeout(function() {
						var s = doc.createElement('script');
						s.type = 'text/javascript';
						s.src = url;
						doc.documentElement.appendChild(s);
					}, 1);
				})(url);
			}
			return this;
		},
		check_callbacks: function() {
			for(var i=0, cbi; cbi=this.callbacks[i++];) {
				var packages = cbi.packages,
					cb = cbi.cb;
				var loaded = 0;
				for(var j=0, p; p=packages[j++];) {
					if(this.scripts[p] && this.scripts[p].loaded)
						++loaded;
				}
				if(loaded == packages.length && cb) {
					this.callbacks.splice(--i, 1);
					cb();
				}
			}
		},
		require: function(/*packages, fn*/) {
			var fn = function(){};
			var packages = [];
			for(var i=0, p; p=arguments[i++];) {
				if(typeof p == 'function') { // first function breaks loop
					fn = p;
					break;
				} else if(typeof p == 'string') {
					packages.push(p);
				}
			}
			this.load(packages);
			this.callbacks.push({packages: packages, cb: fn});
			this.check_callbacks();
			return this;
		},
		module: function(name, fn) {
			if(!this.scripts[name]) {
				this.scripts[name] = {};
			}
			if(!this.scripts[name].loaded) {
				this.scripts[name].loaded = true;
				if(fn) {
					fn();
				}
			}
			this.check_callbacks();
			return this;
		}
	},
	fire_ready = function() {
		jsLoader.module(DOMREADY);
	};

	 // emulate domready as it is a module
	jsLoader[DOMREADY] = function(fn) {
		jsLoader.require(DOMREADY, fn);
	};

	if (wnd.addEventListener) { // W3C
		doc.addEventListener("DOMContentLoaded", fire_ready, false);
		wnd.addEventListener("load", fire_ready, false);
	} else if (wnd.attachEvent) { // IE
		doc.attachEvent("onreadystatechange", function() { // for iframes
			if (doc.readyState === "complete") {
				fire_ready();
			}
		});
		if (wnd.frameElement == null && doc.documentElement.doScroll) { // http://javascript.nwbox.com/IEContentLoaded/
			(function() { 
				try {
					doc.documentElement.doScroll("left");
					fire_ready(); 
				} catch(e) {
					setTimeout(arguments.callee, 1);
					return;
				}		
			})();			
		} 
		// fallback
		wnd.attachEvent("onload", fire_ready);		
	}
})();
