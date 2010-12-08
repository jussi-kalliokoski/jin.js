// Copyright 2010 Jussi Kalliokoski. Licensed under MIT License.

(function(document, window, Jin){
	var swipeObjs = [],
	bind = Jin.bind,
	unbind = Jin.unbind,
	grab = Jin.grab,
	ungrab = Jin.ungrab,
	extend = Jin.extend;

	function startSwipe(swipeObj)
	{
		var swipe = {};
		extend(swipe, swipeObj);	
		swipe.swipeObj = swipeObj;
		swipeObj.motions.push(swipe);
		swipe.kill = function()
		{
			clearTimeout(this.timer);
			if (this.onEnd)
				this.onEnd(this.passData);
			for (var i=0; i<swipeObj.motions.length; i++)
				if (swipeObj.motions[i] == this)
					swipeObj.motions.splice(i--, 1);
		}
		return swipe;
	}

	Jin.unswipe = function(elem)
	{
		ungrab(elem);
		for (var i=0; i<swipeObjs.length; i++)
			if (swipeObjs[i].area == elem)
			{
				swipeObjs[i].kill();
				swipeObjs.splice(i--, 1);
			}
	}

	Jin.swipe = function(elem, arg1, arg2, arg3, arg4)
	{
		var swipeObj =
		{
			onMotion: function(){},
			onSwipe: null,
			onEnd: null,
			passData: null,
			affects: this,
			friction: 1.1,
			interval: 50,
			multiple: false
		};
		if (typeof arg1 == 'object')
			extend(swipeObj, arg1);
		else if (typeof arg1 == 'function')
		{
			swipeObj.onMotion = arg1;
			if (typeof arg2 == 'object')
				extend(swipeObj, arg2);
			else if(typeof arg2 == 'function')
			{
				swipeObj.onSwipe = arg2;
				if (typeof arg3 == 'object')
					extend(swipeObj, arg3);
				else if (typeof arg3 == 'function')
				{
					swipeObj.onEnd = arg3;
					if (typeof arg4 == 'object')
						extend(swipeObj, arg4);
				}
			}
		}
		else
			throw 'Invalid arguments.';
		if (swipeObj.friction <= 1)
			throw 'Invalid arguments: Friction must be over 1.';
		extend(swipeObj,
		{
			previousAngle: null,
			previousX: null,
			previousY: null,
			motionX: 0,
			motionY: 0,
			area: elem,
			released: true,
			timer: null,
			motions: [],
			kill: function()
			{
				for (var i=0; i<this.motions.length; i++)
					this.motions[i].kill();
			}
		});
		swipeObjs.push(swipeObj);
		grab(elem, {
			onstart: function(e)
			{
				if (e.data.onSwipe && !e.data.onSwipe.apply(e.data.area, [e, e.data.passData]))
					return;
				if (!e.data.multiple && e.data.motions.length)
					e.data.motions[0].kill();
				var swipe = startSwipe(e.data);
				swipe.motionX = 0;
				swipe.motionY = 0;
				swipe.released = false;
				swipe.timer = setInterval(function()
				{
					if (swipe.motionX == 0 && swipe.motionY == 0 && swipe.released)
						return swipe.kill();
					swipe.onMotion.apply(swipe.area, [swipe.motionX, swipe.motionY, swipe.passData]);
					swipe.motionX /= swipe.friction;
					swipe.motionY /= swipe.friction;
					if (swipe.motionX < 0.1 && swipe.motionX > -0.1)
						swipe.motionX = 0;
					if (swipe.motionY < 0.1 && swipe.motionY > -0.1)
						swipe.motionY = 0;
				}, swipe.interval);
				e.data = swipe;
			},
			onmove: function(e)
			{
				e.data.motionX += e.move.x / 10;
				e.data.motionY += e.move.y / 10;
			},
			onfinish: function(e)
			{
				e.data.released = true;
			},
			data: swipeObj
		});
	};
})(document, window, Jin);
