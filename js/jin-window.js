(function(document, window, Jin){
	Jin.window = function(options)
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
			onclose: null
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
				for (var i=0; i<windows.length; i++)
					if (windows[i] == that)
						windows.splice(i--, 1);
				window.parentNode.removeChild(window);
				that = null;
			}

			function minimize()
			{
				
			}

			function maximize()
			{
				
			}

			function move(left, top)
			{
				if (left !== null)
				{
					that.left = adapt(that.left, left);
					window.style['left'] = that.left+'px';
				}
				if (top !== null)
				{
					that.top = adapt(that.top, top);
					window.style['top'] = that.top+'px';
				}
			}

			function resize(width, height)
			{
				if (width !== null)
				{
					that.width = adapt(that.width, width);
					window.style['width'] = that.width+'px';
				}
				if (height != null)
				{
					that.height = adapt(that.height, height);
					window.style['height'] = that.height+'px';
				}
			}
		};
		return wnd;
	};

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
})(document, window, Jin);
