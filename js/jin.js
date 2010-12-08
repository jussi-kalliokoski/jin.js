var Jin;
(function (document, window){

	function adapt(original, modifier)
	{
		if (typeof modifier == 'string')
			return original + new Number(modifier.substr(1));
		return modifier;
	}

	function extend(obj)
	{
		var i, n;
		for (i=1; i<arguments.length; i++)
			for (n in arguments[i])
				obj[n] = arguments[i][n];
	}

	function appendChildren(parent)
	{
		var i;
		for (i=1; i<arguments.length; i++)
			parent.appendChild(arguments[i]);
	}

	function hasClass(elem, cl)
	{
		var classes, i, n, hasClass, elems = (typeof elem == 'array') ? elem : [elem];
		for (i=0; i < elems.length; i++)
		{
			classes = elems[i].className.split(' ');
			for (n=0; n < classes.length; n++)
				if (classes[n] == cl)
					return true;
		}
		return false;
	}

	function hasClasses(elem, cls)
	{
		var cl = cls, i;
		if (typeof cl == 'string')
			cl = cl.split(' ');
		for (i=0; i<cl.length; i++)
			if (!hasClasses)
				return false;
		return true;
	}

	function addClass(elem, cl)
	{
		var classes, i, n, hasClass, elems = (typeof elem == 'array') ? elem : [elem];
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

	function addClasses(elem, cls)
	{
		var cl = cls, i;
		if (typeof cl == 'string')
			cl = cl.split(' ');
		for (i=0; i<cl.length; i++)
			addClass(elem, cl[i]);
	}

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

	function removeClasses(elem, cls)
	{
		var cl = cls, i;
		if (typeof cl == 'string')
			cl = cl.split(' ');
		for (i=0; i<cl.length; i++)
			removeClass(elem, cl[i]);
	}

	function bind(elem, type, func, pass)
	{
		var fnc, i;
		if (typeof elem == 'array')
		{
			for (i=0; i<elem.length; i++)
				bind(elem[i], type, func, pass);
			return;
		}
		var fnc = function(e)
		{
			e.data = pass;
			func(e);
		}
		elem.addEventListener(type, fnc, false);
		if (!elem._binds)
			elem._binds = [];
		elem._binds.push({type: type, func: func, fnc: fnc});
	}

	function unbind(elem, type, func)
	{
		var fnc, i;
		if (typeof elem == 'array')
		{
			for (i=0; i<elem.length; i++)
				unbind(elem[i], type, func, pass);
			return;
		}
		if (elem._binds)
		for (var i=0; i<elem._binds.length; i++)
			if (elem._binds[i].type == type && elem._binds[i].func == func)
				elem.removeEventListener(type, elem._binds[i].fnc, false);
			
	}

	function getOffset(elem, parent)
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

	// Element grabber
	var grab;
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
				stopPropagation: true,
				preventDefault: true,
				touch: false // Not implemented yet
			}
			extend(data, options);
			bind(elem, 'mousedown', mousedown, data);
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
	})();

	function getContentSize(elem)
	{
		// Make something up here.
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
		getOffset: getOffset,
		adapt: adapt,
		extend: extend,
		appendChildren: appendChildren,
		getContentSize: getContentSize
	};
})(document, window);
