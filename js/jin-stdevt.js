(function(Jin){ // This is a module to make different event implementations behave similarly.
	var	bind = Jin.bind,
		unbind = Jin.unbind,
		stdevt = Jin.stdevt = {},
		extend = Jin.extend;
	bind.mousescroll =
	{
		bind: function(elem, type, func, pass)
		{
			var fnc = function(e)
			{
				if (!e) // Fix some ie bugs...
					e = window.event;
				if (!e.stopPropagation)
					e.stopPropagation = function(){ this.cancelBubble = true; };
				e.data = pass;
				var delta = 0;
				if (e.wheelDelta)
				{
					delta = event.wheelDelta / 120;
					if (window.opera)
						delta = -delta;
				}
				else if (e.detail)
					delta = -e.detail / 3;
				e.delta = delta;
				if (delta)
					func.call(elem, e);
			}
			if (document.addEventListener)
			{
				elem.addEventListener('mousewheel', fnc, false);
				elem.addEventListener('DOMMouseScroll', fnc, false);
			}
			else
			{
				elem.attachEvent('onmousewheel', fnc);
				elem.attachEvent('onDOMMouseScroll', fnc);
			}
			if (!elem._binds)
				elem._binds = [];
			elem._binds.push({type: 'mousewheel', func: func, fnc: fnc});
			elem._binds.push({type: 'DOMMouseScroll', func: func, fnc: fnc});
		},
		unbind: function(elem, type, func)
		{
			unbind(elem, 'mousewheel', func);
			unbind(elem, 'DOMMouseScroll', func);
		},
		trigger: function(){} // We should do something here, too...
	};

	(function(){ // Detect touch support
		var el = document.createElement('div'),
		properties = ['touchstart', 'touchmove', 'touchend', 'touchcancel', 'gesturestart', 'gesturechange', 'gestureend', 'gesturecancel', 'MozTouchDown', 'MozTouchMove', 'MozTouchUp'],
		support = {touches: 0, gestures: 0, moztouches: 0}, i, evname;
		for (i=0; i<properties.length; i++)
		{
			evname = 'on' + properties[i].toLowerCase();
			support[properties[i]] = !!(evname in el);
			if (!support[properties[i]])
			{
				el.setAttribute(evname, 'return;');
				support[properties[i]] = typeof el[evname] == 'function';
			}
		}
		el = null;
		with (support)
		{
			touches = touchstart && touchend && touchmove;
			gestures = gesturestart && gesturechange && gesturechange;
			moztouches = MozTouchDown && MozTouchMove && MozTouchUp;
		}
		stdevt.touchSupport = support;
		//So... What do we do with these...?
	})();

	// Element grabber
	(function(){
		Jin('grab', grab);
		Jin('ungrab', ungrab);
		function grab(elem, options)
		{
			var data =
			{
				move: {x: 0, y: 0},
				offset: {x: 0, y: 0},
				position: {x: 0, y: 0},
				start: {x: 0, y: 0},
				affects: document.documentElement,
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
})(Jin);
