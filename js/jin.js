(function (window, undefined){
	var
		document = window.document,
		settings = {},
		modules = {},
		fn = {},
		NodeList = (document.getElementsByClassName) ? document.getElementsByClassName('').constructor : undefined;


	function addModule(name, func)
	{
		Jin[name] = Jin.fn[name] = func;
		func.name = name;
		/* !CONDITIONAL if(f.debug) */console.log('Added module '+name);/* !CONDITIONAL */
	}

	fn.settings = settings;
	fn.version = '0.1 Beta';
	fn.fn = fn;
	window.Jin = Jin;
	extend(Jin, fn);
	addModule('addModule', addModule);

	/* !CONDITIONAL if(f.adapt) */
	addModule('adapt', adapt);
	function adapt(original, modifier)
	{
		if (modifier.constructor === String)
			return original + new Number(modifier.substr(1));
		return modifier;
	}

	/* !CONDITIONAL if(f.extend) */
	addModule('extend', extend);
	function extend(obj)
	{
		var i, n;
		for (i=1; i<arguments.length; i++)
			for (n in arguments[i])
				obj[n] = arguments[i][n];
	}

	/* !CONDITIONAL if(f.appendChildren) */
	addModule('appendChildren', appendChildren);
	function appendChildren(parent)
	{
		var i;
		if (isArrayish(arguments[1]))
			for (i=0; i<arguments[1].length; i++)
				parent.appendChild(arguments[1][i])
		else
			for (i=1; i<arguments.length; i++)
				parent.appendChild(arguments[i]);
	}

	/* !CONDITIONAL if(f.hasClass) */
	addModule('hasClass', hasClass);
	function hasClass(elem, cl)
	{
		var classes, i, n, hasClass, elems = (isArrayish(elem)) ? elem : [elem];
		for (i=0; i < elems.length; i++)
		{
			classes = elems[i].className.split(' ');
			for (n=0; n < classes.length; n++)
				if (classes[n] == cl)
					return true;
		}
		return false;
	}

	/* !CONDITIONAL if(f.hasClass && f.hasClasses) */
	addModule('hasClasses', hasClasses);
	function hasClasses(elem, cls)
	{
		var cl = cls, i;
		if (cl.constructor === String)
			cl = cl.split(' ');
		for (i=0; i<cl.length; i++)
			if (!hasClasses)
				return false;
		return true;
	}

	/* !CONDITIONAL if(f.addClass) */
	addModule('addClass', addClass);
	function addClass(elem, cl)
	{
		var classes, i, n, hasClass, elems = (isArrayish(elem)) ? elem : [elem];
		for (i=0; i < elems.length; i++)
		{
			hasClass = false;
			if (elems[i].className.length == 0)
				classes = [];
			else
				classes = elems[i].className.split(' ');
			for (n=0; n < classes.length; n++)
				if (classes[n] == cl)
				{
					hasClass = true;
					break;
				}
			if (!hasClass)
				classes.push(cl);
			elems[i].className = classes.join(' ');
		}
	}

	/* !CONDITIONAL if(f.addClass && f.addClasses) */
	addModule('addClasses', addClasses);
	function addClasses(elem, cls) // Requires addClass()
	{
		var cl = cls, i;
		if (cl.constructor === String)
			cl = cl.split(' ');
		for (i=0; i<cl.length; i++)
			addClass(elem, cl[i]);
	}

	/* !CONDITIONAL if(f.removeClass) */
	addModule('removeClass', removeClass);
	function removeClass(elem, cl)
	{
		var classes, i, n, hasClass, elems = (elem.length) ? elem : [elem];
		for (i=0; i < elems.length; i++)
		{
			hasClass = false;
			if (elems[i].className.length == 0)
				classes = [];
			else
				classes = elems[i].className.split(' ');
			for (n=0; n < classes.length; n++)
				if (classes[n] == cl)
					classes.splice(n--, 1);
			elems[i].className = classes.join(' ');
		}
	}

	/* !CONDITIONAL if(f.removeClass && f.removeClasses) */
	addModule('removeClasses', removeClasses);
	function removeClasses(elem, cls) // Requires removeClasses()
	{
		var cl = cls, i;
		if (cl.constructor === String)
			cl = cl.split(' ');
		for (i=0; i<cl.length; i++)
			removeClass(elem, cl[i]);
	}

	/* !CONDITIONAL if(f.toggleClass && f.removeClass && f.addClass && f.hasClass) */
	addModule('toggleClass', toggleClass);
	function toggleClass(elem, cls) // Requires hasClass(), addClass() and removeClass()
	{
		if (hasClass(elem, cls))
			removeClass(elem, cls);
		else
			addClass(elem, cls);
	}

	/* !CONDITIONAL if(f.toggleClass && f.removeClass && f.addClass && f.hasClass && f.toggleClasses) */
	addModule('toggleClasses', toggleClasses);
	function toggleClasses(elem, cls) // Requires toggleClass and its dependencies
	{
		var cl = cls, i;
		if (cl.constructor === String)
			cl = cl.split(' ');
		for (i=0; i<cl.length; i++)
			toggleClass(elem, cl[i]);
	}

	/* !CONDITIONAL if(f.bind) */
	addModule('bind', bind);
	function bind(elem, type, func, pass)
	{
		var fnc, i;
		if (isArrayish(elem))
		{
			for (i=0; i<elem.length; i++)
				bind(elem[i], type, func, pass);
			return;
		}
		var elem = (elem === document && typeof elem['on'+type] === typeof undefined) ? elem.documentElement : elem;
		if (bind[type])
			return bind[type].bind(elem, type, func, pass);
		var fnc = function(e)
		{
			e.data = pass;
			if (!e.stopPropagation) // Fixes a nasty IE anti-standard.
				e.stopPropagation = function(){ this.cancelBubble = true; };
			func.call(elem, e);
		}
		if (document.addEventListener)
			elem.addEventListener(type, fnc, false);
		else
			elem.attachEvent('on' + type, fnc);
		if (!elem._binds)
			elem._binds = [];
		elem._binds.push({type: type, func: func, fnc: fnc});
	}
	addModule('unbind', unbind);
	function unbind(elem, type, func)
	{
		var fnc, i;
		if (isArrayish(elem))
		{
			for (i=0; i<elem.length; i++)
				unbind(elem[i], type, func, pass);
			return;
		}
		if (bind[type])
			return bind[type].unbind(elem, type, func);
		if (elem._binds)
		for (var i=0; i<elem._binds.length; i++)
			if (elem._binds[i].type == type && elem._binds[i].func == func)
				if (document.removeEventListener)
					elem.removeEventListener(type, elem._binds[i].fnc, false);
				else
					elem.detachEvent('on'+type, elem._binds[i].fnc);
	}
	addModule('trigger', trigger);
	function trigger(elem, type)
	{
		var i, event, propagate = true;
		if (isArrayish(elem))
		{
			for (i=0; i<elem.length; i++)
				trigger(elem[i], type);
			return;
		}
		if (bind[type])
			return bind[type].trigger(elem, type);
		event = {
			preventDefault: function(){ this.isDefaultPrevented = true; },
			isDefaultPrevented: true,
			stopPropagation: function(){ propagate = false; }
		};
		if (elem._binds)
			for (var i=0; i<elem._binds.length; i++)
				if (elem._binds[i].type == type && propagate)
					elem._binds[i].fnc.call(elem, event);
		if (elem['on'+type] && propagate)
			elem['on'+type].call(elem, event);
	}

	/* !CONDITIONAL if(f.getOffset) */
	addModule('getOffset', getOffset);
	function getOffset(elem, parent) // Independent
	{
		var pElement = elem, top = 0, left = 0;
		while (pElement && pElement != parent)
		{
			left += pElement.offsetLeft;
			top += pElement.offsetTop;
			left -= pElement.scrollLeft;
			top -= pElement.scrollTop;
			pElement = pElement.parentNode;
		}
		return {x: left, y: top};
	}

	/* !CONDITIONAL if(f.isArray) */
	addModule('isArray', isArray);
	function isArray(obj) // Are there faster / more reliable methods out there?
	{
		return !!(obj && obj.constructor === Array);
	}

	/* !CONDITIONAL if(f.isArrayish) */
	addModule('isArrayish', isArrayish);
	function isArrayish(obj) // Same as isArray, but also accepts NodeList
	{
		return !!(obj && (obj.constructor === Array || obj.constructor === NodeList));
	}


	/* !CONDITIONAL if(f.grab) */

	// Element grabber
	(function(){
		addModule('grab', grab);
		addModule('ungrab', ungrab);
		function grab(elem, options)
		{
			var data =
			{
				move: {x: 0, y: 0},
				offset: {x: 0, y: 0},
				position: {x: 0, y: 0},
				start: {x: 0, y: 0},
				affects: document,
				stopPropagation: false,
				preventDefault: true,
				touch: true // Implementation unfinished, and doesn't support multitouch
			}
			extend(data, options);
			bind(elem, 'mousedown', mousedown, data);
			if (data.touch)
				bind(elem, 'touchstart', touchstart, data);
		}
		function ungrab(elem)
		{
			unbind(elem, 'mousedown', mousedown);
		}
		function mousedown(e)
		{
			e.data.position.x = e.pageX;
			e.data.position.y = e.pageY;
			e.data.start.x = e.pageX;
			e.data.start.y = e.pageY;
			e.data.event = e;
			if (e.data.onstart && e.data.onstart(e.data))
				return;
			if (e.preventDefault && e.data.preventDefault)
				e.preventDefault();
			if (e.stopPropagation && e.data.stopPropagation)
				e.stopPropagation();
			bind(e.data.affects, 'mousemove', mousemove, e.data);
			bind(e.data.affects, 'mouseup', mouseup, e.data);
		}
		function mousemove(e)
		{
			if (e.preventDefault && e.data.preventDefault)
				e.preventDefault();
			if (e.stopPropagation && e.data.stopPropagation)
				e.stopPropagation();
			e.data.move.x = e.pageX - e.data.position.x;
			e.data.move.y = e.pageY - e.data.position.y;
			e.data.position.x = e.pageX;
			e.data.position.y = e.pageY;
			e.data.offset.x = e.pageX - e.data.start.x;
			e.data.offset.y = e.pageY - e.data.start.y;
			e.data.event = e;
			if (e.data.onmove)
				e.data.onmove(e.data);
		}
		function mouseup(e)
		{
			if (e.preventDefault && e.data.preventDefault)
				e.preventDefault();
			if (e.stopPropagation && e.data.stopPropagation)
				e.stopPropagation();
			unbind(e.data.affects, 'mousemove', mousemove);
			unbind(e.data.affects, 'mouseup', mouseup);
			e.data.event = e;
			if (e.data.onfinish)
				e.data.onfinish(e.data);
		}
		function touchstart(e)
		{
			e.data.position.x = e.touches[0].pageX;
			e.data.position.y = e.touches[0].pageY;
			e.data.start.x = e.touches[0].pageX;
			e.data.start.y = e.touches[0].pageY;
			e.data.event = e;
			if (e.data.onstart && e.data.onstart(e.data))
				return;
			if (e.preventDefault && e.data.preventDefault)
				e.preventDefault();
			if (e.stopPropagation && e.data.stopPropagation)
				e.stopPropagation();
			bind(e.data.affects, 'touchmove', touchmove, e.data);
			bind(e.data.affects, 'touchend', touchend, e.data);
		}
		function touchmove(e)
		{
			if (e.preventDefault && e.data.preventDefault)
				e.preventDefault();
			if (e.stopPropagation && e.data.stopPropagation)
				e.stopPropagation();
			e.data.move.x = e.touches[0].pageX - e.data.position.x;
			e.data.move.y = e.touches[0].pageY - e.data.position.y;
			e.data.position.x = e.touches[0].pageX;
			e.data.position.y = e.touches[0].pageY;
			e.data.offset.x = e.touches[0].pageX - e.data.start.x;
			e.data.offset.y = e.touches[0].pageY - e.data.start.y;
			e.data.event = e;
			if (e.data.onmove)
				e.data.onmove(e.data);
		}
		function touchend(e)
		{
			if (e.preventDefault && e.data.preventDefault)
				e.preventDefault();
			if (e.stopPropagation && e.data.stopPropagation)
				e.stopPropagation();
			unbind(e.data.affects, 'touchmove', touchmove);
			unbind(e.data.affects, 'touchend', touchend);
			e.data.event = e;
			if (e.data.onfinish)
				e.data.onfinish(e.data);
		}
	})();

	/* !CONDITIONAL if(f.layer && f.isArrayish && f.extend) { */
	addModule('layer', layer);
	/* !CONDITIONAL if(f.bind) */
	layer.prototype.bind = function(a, b, c){ return this.each(function(){ return bind(this, a, b, c); }); };
	layer.prototype.unbind = function(a, b){ return this.each(function(){ return unbind(this, a, b); }); };
	layer.prototype.trigger = function(a){ return this.each(function(){ return trigger(this, a); }); };
	/* !CONDITIONAL if(f.experimentalCss) */
	layer.prototype.experimentalCss = function(a, b){ return this.each(function(){ return experimentalCss(this, a, b); }); };
	/* !CONDITIONAL if(f.grab) */
	layer.prototype.grab = function(a, b){ return this.each(function(){ return grab(this, a, b); }); };
	layer.prototype.ungrab = function(a){ return this.each(function(){ return ungrab(this, a); }); };
	/* !CONDITIONAL if(f.getOffset) */
	layer.prototype.getOffset = function(i){ if (!i) i=0; return getOffset(this[i]); };
	/* !CONDITIONAL if(f.getSize) */
	layer.prototype.getSize = function(i){ if (!i) i=0; return getSize(this[i]); };
	/* !CONDITIONAL if(f.hasClass) */
	layer.prototype.hasClass = function(a){ var b = false; this.each(function(){ if (hasClass(this, a)) b = true; }); return b; };
	/* !CONDITIONAL if(f.hasClasses) */
	layer.prototype.hasClasses = function(a){ var b = false; this.each(function(){ if (hasClasses(this, a)) b = true; }); return b; };
	/* !CONDITIONAL if(f.addClass) */
	layer.prototype.addClass = function(a){ return this.each(function(){ return addClass(this, a); }); };
	/* !CONDITIONAL if(f.addClasses) */
	layer.prototype.addClasses = function(a){ return this.each(function(){ return addClasses(this, a); }); };
	/* !CONDITIONAL if(f.removeClass) */
	layer.prototype.removeClass = function(a){ return this.each(function(){ return removeClass(this, a); }); };
	/* !CONDITIONAL if(f.removeClasses) */
	layer.prototype.removeClasses = function(a){ return this.each(function(){ return removeClasses(this, a); }); };
	/* !CONDITIONAL if(f.toggleClass) */
	layer.prototype.toggleClass = function(a){ return this.each(function(){ return toggleClass(this, a); }); };
	/* !CONDITIONAL if(f.toggleClasses) */
	layer.prototype.toggleClasses = function(a){ return this.each(function(){ return toggleClasses(this, a); }); };
	/* !CONDITIONAL if(f.onReady) */
	layer.prototype.ready = function(a, b){ return onReady(a, b); }; // For jQuery migrators
	/* !CONDITIONAL */
	function layer()
	{
		var lr = [], i;
		if (isArrayish(arguments[0]))
			for (i=0; i<arguments[0].length; i++)
				lr.push(arguments[0][i]);
		else
			for (i=0; i<arguments.length; i++)
				lr.push(arguments[i]);
		lr._concat = lr.concat;
		extend(lr, {
			refresh: function()
			{
				for (var i=0; i<this.length; i++)
					setAlign(this[i], i);
			},
			indexOf: function(elem)
			{
				for (var i=0; i<this.length; i++)
					if (this[i] === elem)
						return i;
				return -1;
			},
			first: function()
			{
				return layer(this[0]);
			},
			last: function()
			{
				return layer(this[this.length-1]);
			},
			item: function(i)
			{
				return layer(this[i]);
			},
			move: function(elem, to)
			{
				if (to >= this.length - 1)
					return this.toTop(elem);
				if (to <= 0)
					return this.toBottom(elem);
				this.splice(this.indexOf(elem), 1);
				this.splice(to, 0, elem);
			},
			toBottom: function(elem)
			{
				this.splice(this.indexOf(elem), 1);
				this.unshift(elem);
			},
			toTop: function(elem)
			{
				this.splice(this.indexOf(elem), 1);
				this.push(elem);
			},
			remove: function(elem)
			{
				this.splice(this.indexOf(elem), 1);
			},
			alignByDistance: function(fromelem, lefttoright, reorder)
			{
				var point = this.indexOf(fromelem), dist = Math.max(point, this.length - point - 1) + 1, maxDist = dist;
				while (--dist)
				{
					if (lefttoright)
					{
						if (point - dist >= 0)
							setAlign(this[point - dist], (maxDist - dist) * 2 - 1);
						if (point - dist < this.length)
							setAlign(this[point + dist], (maxDist - dist) * 2);
					}
					else
					{
						if (point - dist < this.length)
							setAlign(this[point + dist], (maxDist - dist) * 2 - 1);
						if (point - dist >= 0)
							setAlign(this[point - dist], (maxDist - dist) * 2);
					}
				}
				setAlign(fromelem, maxDist * 2);
			},
			each: function(func)
			{
				for (var i=0; i<this.length; i++)
					func.call(this[i], i);
				return this;
			},
			undouble: function()
			{
				for (var i=0, d; i<this.length; i++)
				{
					d = this.indexOf(this[i]);
					if (d !== i)
						this.splice(i--, 1);
				}
				return this;
			},
			concat: function()
			{
				var a, b;
				for (a=0; a<arguments.length; a++)
					for (b=0; b<arguments[a].length; b++)
						this.push(arguments[a][b]);
				return this;
			}
		}, layer.prototype);
		return lr;

		function setAlign(elem, pos)
		{
			elem.style.zIndex = pos;
		}
	};

	/* !CONDITIONAL } if(f.getWindowSize) */
	addModule('getWindowSize', getWindowSize);
	function getWindowSize(wnd)
	{
		if (!wnd)
			wnd = window;
		if (window.document.documentElement)
			return {width: wnd.document.documentElement['clientWidth'], height: wnd.document.documentElement['clientHeight']};
		return {width: elem.document.body['clientWidth'], height: elem.document.body['clientWidth']};
	}

	/* !CONDITIONAL if(f.getSize) */
	addModule('getSize', getSize);
	function getSize(elem)
	{
		return {width: elem.offsetWidth, height: elem.offsetHeight};
	}

	/* !CONDITIONAL if(f.experimentalCss && f.isArrayish) */
	addModule('experimentalCss', experimentalCss);
	function experimentalCss(elem, property, value)
	{
		var prefixes, i;
		if (isArrayish(elem))
		{
			for (i=0; i<elem.length; i++)
				experimentalCss(elem[i], property, value);
			return;
		}
		prefixes = ['', '-webkit-', '-moz-', '-o-'];
		if (!value)
		{
			while(prefixes.length && !value)
				value = elem.style[prefixes.pop() + property];
			return value;
		}
		else
			while (prefixes.length)
				elem.style[prefixes.pop() + property] = value;
	}

	/* !CONDITIONAL if(f.commandLine) */
	var commandLine = new function()
	{
		var path, getdata, iddata;

		function reload()
		{
			if (path == location.href)
				return;
			path = location.href;
			getdata = [];
			iddata = [];
			var pathsplit, getsplit, get, id, i, l, val, splitbreak;
			pathsplit = path.split('?');
			getsplit = pathsplit[pathsplit.length-1].split('#');
			if (pathsplit.length > 1)
			{
				get = getsplit[0].split('&');
				for (i=0, l=get.length; i<l; i++)
				{
					splitbreak = get[i].split('=');
					val = (splitbreak.length == 1) ? true : splitbreak[1];
					getdata.push({name: splitbreak[0], value: val});
				}
			}
			if (getsplit.length > 1)
			{
				id = getsplit[1].split('&');
				for (i=0, l=id.length; i<l; i++)
				{
					splitbreak = id[i].split('=');
					val = (splitbreak.length == 1) ? true : splitbreak[1];
					iddata.push({name: splitbreak[0], value: val});
				}
			}
		}

		this.id = function(id)
		{
			reload();
			for (var i=0, l=iddata.length; i<l; i++)
				if (id === iddata[i].name)
					return iddata[i].value;
			return false;
		};

		this.get = function(id)
		{
			reload();
			for (var i=0, l=getdata.length; i<l; i++)
				if (id === getdata[i].name)
					return getdata[i].value;
			return false;
		}
	};
	fn.commandLine = Jin.commandLine = commandLine;

	/* !CONDITIONAL if(f.onReady) */
	addModule('onReady', onReady);
	handleReady();
	bind.ready =
	{
		bind: function(elem, type, func, pass){
			if (elem === document || elem === window)
				return onReady(func, pass);
		},
		unbind: function(){}, // Is this really necessary?
		trigger: function(){
			if (elem === document || elem === window)
				return ready();
		}
	};
	function handleReady() // jQuery-ish :)
	{
		if (ready.bound)
			return;
		ready.bound = true;

		ready.f = [];
		ready.p = [];

		if (document.readyState === 'complete')
			return setTimeout(ready, 1);
		if (document.addEventListener)
		{
			document.addEventListener('DOMContentLoaded', DOMReady, false);
			window.addEventListener('load', ready, false);
		}
		else if (document.attachEvent)
		{
			document.attachEvent('onreadystatechange', DOMReady, false);
			window.attachEvent('onload', ready);
		}
	}

	function DOMReady()
	{
		if (document.removeEventListener)
			document.removeEventListener('DOMContentLoaded', DOMReady, false);
		else if (document.detachEvent)
		{
			if (document.readyState !== 'complete')
				return;
			document.detachEvent('onreadystatechange', DOMReady);
		}
		ready();
	}

	function ready()
	{
		if (ready.triggered)
			return;
		ready.triggered = true;
		var propagate = true,
		e = {stopPropagation: function(){ propagate = false; }},
		i;
		for (i=0; i < ready.f.length && propagate; i++)
		{
			e.data = ready.p[i];
			ready.f[i].call(document, e);
		}
	}

	function onReady(func, pd)
	{
		if (ready.triggered)
			return func.call(document, {stopPropagation: function(){}, data: pd});
		ready.f.push(func);
		ready.p.push(pd);
	}

	/* !CONDITIONAL */

	function Jin(arg1, arg2)
	{

		/* !CONDITIONAL if(f.onReady) */
		if (arg1.constructor === Function)
			return onReady(arg1, arg2);
		/* !CONDITIONAL if(f.addModule) */
		if (arg1.constructor === String && arg2.constructor === Function)
			return addModule(arg1, arg2);
		/* !CONDITIONAL if(f.layer) */
		if (isArrayish(arg1))
			return layer(arg1);
		if (arguments.length)
			return layer.apply(this, arguments);
		/* !CONDITIONAL */
		return Jin;
	}
})(window);
