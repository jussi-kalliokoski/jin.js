(function (window, undefined){
	var
		document = window.document,
		settings = {},
		NodeList = (document.getElementsByClassName) ? document.getElementsByClassName('').constructor : undefined;
	function adapt(original, modifier) // Independent
	{
		if (typeof modifier == 'string')
			return original + new Number(modifier.substr(1));
		return modifier;
	}

	function extend(obj) // Independent
	{
		var i, n;
		for (i=1; i<arguments.length; i++)
			for (n in arguments[i])
				obj[n] = arguments[i][n];
	}

	function appendChildren(parent) // Independent
	{
		var i;
		if (isArrayish(arguments[1]))
			for (i=0; i<arguments[1].length; i++)
				parent.appendChild(arguments[1][i])
		else
			for (i=1; i<arguments.length; i++)
				parent.appendChild(arguments[i]);
	}

	function hasClass(elem, cl) // Independent
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

	function hasClasses(elem, cls) // Requires hasClass()
	{
		var cl = cls, i;
		if (typeof cl == 'string')
			cl = cl.split(' ');
		for (i=0; i<cl.length; i++)
			if (!hasClasses)
				return false;
		return true;
	}

	function addClass(elem, cl) // Independent
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

	function addClasses(elem, cls) // Requires addClass()
	{
		var cl = cls, i;
		if (typeof cl == 'string')
			cl = cl.split(' ');
		for (i=0; i<cl.length; i++)
			addClass(elem, cl[i]);
	}

	function removeClass(elem, cl) // Independent
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

	function removeClasses(elem, cls) // Requires removeClasses()
	{
		var cl = cls, i;
		if (typeof cl == 'string')
			cl = cl.split(' ');
		for (i=0; i<cl.length; i++)
			removeClass(elem, cl[i]);
	}

	function toggleClass(elem, cls) // Requires hasClass(), addClass() and removeClass()
	{
		if (hasClass(elem, cls))
			removeClass(elem, cls);
		else
			addClass(elem, cls);
	}

	function toggleClasses(elem, cls) // Requires toggleClass and its dependencies
	{
		var cl = cls, i;
		if (typeof cl == 'string')
			cl = cl.split(' ');
		for (i=0; i<cl.length; i++)
			toggleClass(elem, cl[i]);
	}

	function bind(elem, type, func, pass) // Independent
	{
		var fnc, i;
		if (isArrayish(elem))
		{
			for (i=0; i<elem.length; i++)
				bind(elem[i], type, func, pass);
			return;
		}
		var fnc = function(e)
		{
			e.data = pass;
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

	function unbind(elem, type, func) // Independent
	{
		var fnc, i;
		if (isArrayish(elem))
		{
			for (i=0; i<elem.length; i++)
				unbind(elem[i], type, func, pass);
			return;
		}
		if (elem._binds)
		for (var i=0; i<elem._binds.length; i++)
			if (elem._binds[i].type == type && elem._binds[i].func == func)
				if (document.removeEventListener)
					elem.removeEventListener(type, elem._binds[i].fnc, false);
				else
					elem.detachEvent('on'+type, elem._binds[i].fnc);
			
	}

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

	function isArray(obj) // Independent, are there faster / more reliable methods out there?
	{
		return !!(obj && obj.constructor === Array);
	}

	function isArrayish(obj) // Independent, same as isArray, but also accepts NodeList
	{
		return !!(obj && (obj.constructor === Array || obj.constructor === NodeList));
	}
	

	// Element grabber, requires bind() and unbind() and their depencencies
	var grab, ungrab;
	(function(){
		grab = function(elem, options)
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
		ungrab = function(elem)
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

	function layer() // Requires isArrayish()
	{
		var lr = [], i;
		if (isArrayish(arguments[0]))
			for (i=0; i<arguments[0].length; i++)
				lr.push(arguments[0][i]);
		else
			for (i=0; i<arguments.length; i++)
				lr.push(arguments[i]);
		lr.refresh = function()
		{
			for (var i=0; i<this.length; i++)
				setAlign(this[i], i);
		};
		lr.indexOf = function(elem)
		{
			for (var i=0; i<this.length; i++)
				if (this[i] === elem)
					return i;
			return -1;
		}
		lr.bottom = lr.first = function()
		{
			return this[0];
		}
		lr.top = lr.last = function()
		{
			return this[this.length-1];
		}
		lr.move = function(elem, to)
		{
			if (to >= this.length - 1)
				return this.toTop(elem);
			if (to <= 0)
				return this.toBottom(elem);
			this.splice(this.indexOf(elem), 1);
			this.splice(to, 0, elem);
		}
		lr.toBottom = function(elem)
		{
			this.splice(this.indexOf(elem), 1);
			this.unshift(elem);
		}
		lr.toTop = function(elem)
		{
			this.splice(this.indexOf(elem), 1);
			this.push(elem);
		}
		lr.remove = function(elem)
		{
			this.splice(this.indexOf(elem), 1);
		}
		return lr;

		function setAlign(elem, pos)
		{
			elem.style.zIndex = pos;
		}
	};

	function getWindowSize(wnd) // Independent
	{
		if (!wnd)
			wnd = window;
		if (window.document.documentElement)
			return {width: wnd.document.documentElement['clientWidth'], height: wnd.document.documentElement['clientHeight']};
		return {width: elem.document.body['clientWidth'], height: elem.document.body['clientWidth']};
	}

	function getContentSize(elem) // Independent
	{
		return {width: elem.offsetWidth, height: elem.offsetHeight};
	}

	function experimentalCss(elem, property, value) // Requires isArrayish()
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

	function addModule(name, func)
	{
		Jin[name] = Jin.fn[name] = func;
		//console.log('Added module '+name);
	}

	var fn = Jin.prototype = {
		bind: bind,
		unbind: unbind,
		grab: grab,
		addClasses: addClasses,
		addClass: addClass,
		removeClasses: removeClasses,
		removeClass: removeClass,
		hasClasses: hasClasses,
		hasClass: hasClass,
		toggleClass: toggleClass,
		toggleClasses: toggleClasses,
		getOffset: getOffset,
		adapt: adapt,
		extend: extend,
		appendChildren: appendChildren,
		getContentSize: getContentSize,
		getWindowSize: getWindowSize,
		layer: layer,
		isArray: isArray,
		isArrayish: isArrayish,
		experimentalCss: experimentalCss,
		commandLine: commandLine,
		addModule: addModule,
		settings: settings,
		version: '0.1 Beta'
	};

	fn.fn = fn;

	window.Jin = Jin;
	extend(Jin, fn);

	function Jin(arg1, arg2)
	{
		if (typeof arg1 == 'function')
			return bind(window, 'load', arg1);
		if (typeof arg1 == 'string' && typeof arg2 == 'function')
			return addModule(arg1, arg2);
		if (isArrayish(arg1))
			return layer(arg1);
		if (arguments.length)
			return layer.apply(this, arguments);
		return Jin;
	}
})(window);
