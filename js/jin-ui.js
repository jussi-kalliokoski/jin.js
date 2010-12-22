(function(document, Jin, undefined){
	function jinWindow(options)
	{
		var opts = 
		{
			title: 'New Window',
			buttonCaptions: ['X', '+', '-', '_'],
			state: 0,
			left: 50,
			top: 0,
			width: 400,
			height: 300,
			closeButton: true,
			minButton: true,
			resizable: true,
			visible: true,
			onclose: undefined,
		}
		wnd = new function JindowWindow()
		{
			extend(this, opts, options);
			var that = this,
			window = createDiv(),
			titlebar = createDiv(),
			contentbox = createDiv(),
			controlbox = createDiv(),
			menubox = createDiv(),
			titlebox = createDiv(),
			btnClose = createElem('button'),
			btnMaxRes = createElem('button'),
			btnMinimize = createElem('button');

			appendChildren(window, titlebar, contentbox);
			appendChildren(titlebar, titlebox, menubox, controlbox);
			appendChildren(controlbox, btnMinimize, btnMaxRes, btnClose);

			addClass(window, 'window');
			addClass(titlebar, 'titlebar');
			addClass(contentbox, 'content');
			addClass(controlbox, 'controls');
			addClass(menubox, 'menu');
			addClass(titlebox, 'title');
			addClass(btnClose, 'close');
			addClass(btnMaxRes, 'maximize');
			addClass(btnMinimize, 'minimize');

			btnClose.title = 'Close';
			btnMinimize.title = 'Minimize';

			bind(btnClose, 'click', close);
			bind(titlebox, 'contextmenu', function(e){
				if (e.preventDefault)
					e.preventDefault();
			});
			grab(titlebox, {
				onstart: function(e){ addClass(document.body, 'moving'); },
				onmove: function(e){ move('='+e.move.x, '='+e.move.y); },
				onfinish: function(e){ removeClass(document.body, 'moving'); }
			});
			grab(window, {
				onstart: function(e)
				{
					var rightSide = (e.position.x > that.left + that.width - 5),
					bottomSide = (e.position.y > that.top + that.height - 5);
					if (rightSide && bottomSide)
						addClass(document.body, 'resizing');
					else
						return true;
				},
				onmove: function(e)
				{
					resize('='+e.move.x, '='+e.move.y);
				},
				onfinish: function(e)
				{
					removeClass(document.body, 'resizing');
				}
			});

			refresh();

			this.dom = window;
			this.body = contentbox;
			this.refresh = refresh;
			this.close = close;
			this.minimize = minimize;
			this.maximize = maximize;
			this.move = move;
			this.resize = resize;

			function refresh()
			{
				titlebox.innerHTML = that.title;
				switch(that.state)
				{
					case 0:
						
						break;
					case 1:
						break;
					case 2:
						break;
					case 3:
						break;
				}
				window.style['display'] = (that.visible && that.state != 4) ? 'block' : 'none';
				window.style['left'] = that.left+'px';
				window.style['top'] = that.top+'px';
				window.style['width'] = that.width+'px';
				window.style['height'] = that.height+'px';
				btnClose.style['display'] = (that.closeButton) ? 'inline' : 'none';
				btnMinimize.style['display'] = (that.minButton) ? 'inline' : 'none';
				btnMaxRes.style['display'] = (that.resizable) ? 'inline' : 'none';
				btnClose.innerHTML = that.buttonCaptions[0];
				btnMaxRes.innerHTML = (that.state != 3) ? that.buttonCaptions[1] : that.buttonCaptions[2];
				btnMinimize.innerHTML = that.buttonCaptions[3];
			}

			function close(force)
			{
				if (that.onclose && !that.onclose() && force !== true)
					return;
				window.parentNode.removeChild(window);
				that = undefined;
			}

			function minimize()
			{
				
			}

			function maximize()
			{
				
			}

			function move(left, top)
			{
				if (left !== undefined)
				{
					that.left = adapt(that.left, left);
					window.style['left'] = that.left+'px';
				}
				if (top !== undefined)
				{
					that.top = adapt(that.top, top);
					window.style['top'] = that.top+'px';
				}
			}

			function resize(width, height)
			{
				if (width !== undefined)
				{
					that.width = adapt(that.width, width);
					window.style['width'] = that.width+'px';
				}
				if (height != undefined)
				{
					that.height = adapt(that.height, height);
					window.style['height'] = that.height+'px';
				}
			}
		};
		return wnd;
	}
	function vslider(options)
	{
		if (this.constructor !== vslider) // Prevents from being called as a function with unexpected results.
			return new vslider(options);

		var	dom = createElem('div'),
			label = createElem('label'),
			control = createElem('div'),
			pointer = createElem('div'),
			value,
			that = this;
		extend(this, {
			name: 'Vertical Slider',
			title: 'Parameter',
			id: 'vs'+Math.floor(Math.random()),
			width: 300,
			height: 20,
			minValue: 0,
			defValue: 0.5,
			maxValue: 1,
			step: 0.01,
			valueArray: undefined
		}, options, {
			dom: dom,
			label: label,
			control: control,
			pointer: pointer
		});

		value = this.defValue;
		
		Jin(dom).appendChildren(label, control).addClass('vslider');
		Jin(control).appendChildren(pointer).addClass('control');
		label.for = this.id;
		label.innerHTML = this.title;
		Jin(pointer).addClass('pointer')
		.grab({
			onstart: function(e){ addClass(dom, 'moving'); },
			onmove: function(e){ var off = Jin.getOffset(dom); setValue((e.position.x - off.left) / that.width); },
			onfinish: function(e){ removeClass(dom, 'moving'); }
		});

		this.__defineGetter__('value', function(){ return value; });
		this.__defineSetter__('value', function(val){ value = Math.round(val / that.step) * that.step; refresh(); });
		this.refresh = refresh;
		this.setValue = setValue;
		this.getValue = getValue;

		refresh();

		function refresh()
		{
			dom.style.width = that.width+'px';
			dom.style.height = that.height+'px';
			pointer.style.marginLeft = (getValue() * that.width - pointer.offsetWidth / 2)+'px';
		}
		function setValue(val)
		{
			if (val > 1)
				val = 1;
			if (val < 0)
				val = 0;
			var s = that.maxValue - that.minValue, sv = s * val;
			value = that.minValue + Math.round(sv / that.step) * that.step;
			refresh();
		}
		function getValue()
		{
			return (value - that.minValue) / (that.maxValue - that.minValue);
		}
	}
	function hslider(){}
	function knob(){}
	function switch2(){}

	Jin('window', jinWindow);
	Jin('vslider', vslider);
	Jin('hslider', hslider);
	Jin('knob', knob);
	Jin('switch', switch2);

	var
		bind = Jin.bind,
		unbind = Jin.unbind,
		grab = Jin.grab,
		addClasses = Jin.addClasses,
		addClass = Jin.addClass,
		removeClasses = Jin.removeClasses,
		removeClass = Jin.removeClass,
		hasClasses = Jin.hasClasses,
		hasClass = Jin.hasClass,
		getOffset = Jin.getOffset,
		adapt = Jin.adapt,
		extend = Jin.extend,
		appendChildren = Jin.appendChildren
	;

	function createDiv()
	{
		return createElem('div');
	}

	function createElem(type)
	{
		return document.createElement(type);
	}
})(document, Jin);
