(function(Jin){ // This is a module to make different event implementations behave similarly.
	var	bind = Jin.bind,
		unbind = Jin.unbind,
		stdevt = Jin.stdevt = {};
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
})(Jin);
