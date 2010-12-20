(function(Jin){ // This is a module to make different event implementations behave similarly.
	var	bind = Jin.bind,
		unbind = Jin.unbind;
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
				else if (event.detail)
					delta = -event.detail / 3;
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
	}
})(Jin);
