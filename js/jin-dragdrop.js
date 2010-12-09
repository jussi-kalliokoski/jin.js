(function(document, Jin, undefined){ // Requires bind, unbind and their dependencies
	var data = undefined,
	settings = Jin.fn.settings,
	mousedown = 'mousedown',
	mousemove = 'mousemove',
	mouseup = 'mouseup',
	touchstart = 'touchstart',
	touchmove = 'touchmove',
	touchend = 'touchend',
	bind = Jin.bind,
	unbind = Jin.unbind;

	settings.dragdrop = {};
	Jin('drag', drag);
	Jin('drop', drop);

	function drag(elem, func)
	{
		bind(elem, mousedown, startdrag, func);
		bind(elem, touchstart, startdrag, func);
	}

	function drop(elem, funcdrop, funcover)
	{
		bind(elem, mousemove, dragover, funcover);
		bind(elem, touchmove, dragover, funcover);
		bind(elem, mouseup, dragfinish, funcdrop);
		bind(elem, touchend, dragfinish, funcdrop);
	}

	function startdrag(e)
	{
		e.setData = function(type, value){ data = {type: type, value: value}; };
		e.data.call(this, e);
		if (data === undefined)
			return;
		bind(document, mouseup, docrelease);
		bind(document, touchend, docrelease);
		bind(document, mousemove, move);
		bind(document, touchmove, move);
		if (e.preventDefault)
			e.preventDefault();
	}

	function dragover(e) // Something here...
	{
		
	}

	function dragfinish(e)
	{
		if (data === undefined)
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
		if ((data === undefined) || (e.touches && e.touches.length))
			return;
		if (e.preventDefault)
			e.preventDefault();
		data = undefined;
		unbind(document, 'mouseup', docrelease);
		unbind(document, 'touchend', docrelease);
		unbind(document, 'mousemove', move);
		unbind(document, 'touchmove', move);
		if (settings.dragdrop.onfinish)
			settings.dragdrop.onfinish.call(this, e);
	}
})(document, Jin);
