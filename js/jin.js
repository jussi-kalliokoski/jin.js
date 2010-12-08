var Jin;
(function (document, window){
	var settings = {};
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
		if (isArray(arguments[1]))
			for (i=0; i<arguments[1].length; i++)
				parent.appendChild(arguments[1][i])
		else
			for (i=1; i<arguments.length; i++)
				parent.appendChild(arguments[i]);
	}

	function hasClass(elem, cl) // Independent
	{
		var classes, i, n, hasClass, elems = (isArray(elem)) ? elem : [elem];
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
		var classes, i, n, hasClass, elems = (isArray(elem)) ? elem : [elem];
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
		if (isArray(elem))
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
		if (isArray(elem))
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

	function isArray(obj) // Independent
	{
		if (obj.constructor.toString().indexOf('Array') == '-1')
			return false;
		return true;
	}

	// Element grabber, requires() bind and unbind()
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

	var drag, drop; // Requires bind, unbind
	(function(){
		settings.dragdrop = {};
		var data = null;
		drag = function(elem, func)
		{
			bind(elem, 'mousedown', startdrag, func);
			bind(elem, 'touchstart', startdrag, func);
		}

		drop = function(elem, funcdrop, funcover)
		{
			bind(elem, 'mousemove', dragover, funcover);
			bind(elem, 'touchmove', dragover, funcover);
			bind(elem, 'mouseup', dragfinish, funcdrop);
			bind(elem, 'touchend', dragfinish, funcdrop);
		}

		function startdrag(e)
		{
			e.setData = function(type, value){ data = {type: type, value: value}; };
			e.data.call(this, e);
			if (data === null)
				return;
			bind(document, 'mouseup', docrelease);
			bind(document, 'touchend', docrelease);
			bind(document, 'mousemove', move);
			bind(document, 'touchmove', move);
			if (e.preventDefault)
				e.preventDefault();
		}

		function dragover(e)
		{
			
		}

		function dragfinish(e)
		{
			if (data === null)
				return;
			e.getData = function(type){ if (data.type == type) return data.value; };
			e.data.call(this, e);
		}

		function move(e)
		{
			if (e.preventDefault)
				e.preventDefault();
			if (e.stopPropagation)
				e.stopPropagation();
		}

		function docrelease(e)
		{
			if ((data === null) || (e.touches && e.touches.length))
				return;
			if (e.preventDefault)
				e.preventDefault();
			data = null;
			unbind(document, 'mouseup', docrelease);
			unbind(document, 'touchend', docrelease);
			unbind(document, 'mousemove', move);
			unbind(document, 'touchmove', move);
			if (settings.dragdrop.onfinish)
				settings.dragdrop.onfinish.call(this, e);
		}
	})();

	function layer() // Independent
	{
		var lr = [], i;
		if (isArray(arguments[0]))
			for (i=0; i<arguments[0].length; i++)
				lr.push(arguments[0][i]);
		else
			for (i=0; i<arguments.length; i++)
				lr.push(arguments[i]);
		lr.refresh = function()
		{
			for (var i=0; i<this.length; i++)
				this[i].style['z-index'] = i;
		};
		lr.indexOf = function(elem)
		{
			for (var i=0; i<this.length; i++)
				if (this[i] === elem)
					return i;
			return -1;
		}
		lr.first = function()
		{
			return this[0];
		}
		lr.last = function()
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
	};

	function getContentSize(elem)
	{
		// Make something up here.
	}

	function experimentalCss(elem, property, value) // Independent
	{
		var prefixes = ['', '-webkit-', '-moz-', '-o-'];
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

	Jin = {
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
		layer: layer,
		isArray: isArray,
		experimentalCss: experimentalCss,
		drag: drag,
		drop: drop,
		settings: settings,
		version: '0.1 Beta'
	};
})(document, window);
