// Copyright 2010 Jussi Kalliokoski. Licensed under MIT License.

(function(document, window, Jin){
	var swipeObjs = [],
	bind = Jin.bind,
	unbind = Jin.unbind,
	grab = Jin.grab,
	ungrab = Jin.ungrab,
	extend = Jin.extend,
	addModule = Jin.addModule;

	Jin('unswipe', unswipe);
	Jin('swipe', swipe);
	Jin('angularSwipe', angularSwipe);

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

	function unswipe(elem)
	{
		ungrab(elem);
		for (var i=0; i<swipeObjs.length; i++)
			if (swipeObjs[i].area == elem)
			{
				swipeObjs[i].kill();
				swipeObjs.splice(i--, 1);
			}
	}

	function swipe(elem, arg1, arg2, arg3, arg4)
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
					return true;
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

	function angularSwipe(elem, arg1, arg2, arg3, arg4)
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
			multiple: false,
			centerX: null,
			centerY: null
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
			motionX: 0,
			motionY: 0,
			area: elem,
			released: true,
			timer: null,
			motions: [],
			circulateX: null,
			circulateY: null,
			previousAngle: null,
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
					return true;
				if (!e.data.multiple && e.data.motions.length)
					e.data.motions[0].kill();
				var swipe = startSwipe(e.data);
				if (!swipe.centerX || !swipe.centerY)
				{
					swipe.circulateX = e.pageX;
					swipe.circulateY = e.pageY;
				}
				else
				{
					swipe.circulateX = swipe.centerX;
					swipe.circulateY = swipe.centerY;
				}
				var newAngle = Math.atan2(e.position.y - swipe.circulateY, e.position.x - swipe.circulateX);
				swipe.previousAngle = newAngle;
				swipe.motion = 0;
				swipe.released = false;
				swipe.timer = setInterval(function()
				{
					if (swipe.motion == 0 && swipe.released)
						return swipe.kill();
					swipe.onMotion.apply(swipe.area, [swipe.motion, swipe.passData]);
					swipe.motion /= swipe.friction;
					if (swipe.motion < 0.1 && swipe.motion > -0.1)
						swipe.motion = 0;
				}, swipe.interval);
				e.data = swipe;
			},
			onmove: function(e)
			{
				var newAngle = Math.atan2(e.position.y - e.data.circulateY, e.position.x - e.data.circulateX),
				angleDiff = newAngle - e.data.previousAngle;
				if (angleDiff > Math.PI)
					angleDiff = Math.PI  * 2 - angleDiff;
				else if (angleDiff < -Math.PI)
					angleDiff += Math.PI * 2;
				e.data.motion += angleDiff;
				e.data.previousAngle = newAngle;
			},
			onfinish: function(e)
			{
				e.data.released = true;
			},
			data: swipeObj
		});
	};
})(document, window, Jin);
