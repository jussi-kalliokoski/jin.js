(function(Jin){ // This will overwrite jin-ui when it's ready.
	function UIWindow(options){
		if (this.constructor !== UIWindow){
			return new UIWindow(options);
			
		}

		extend(this, UIWindowDefaults, options);

		var	that		= this,
			wnd		= create(),
			titlebar	= create(),
			contentbox	= create(),
			menubox		= create(),
			titlebox	= create(),

			btnClose	= create('button'),
			btnMaxRes	= create('button'),
			btnMinimize	= create('button')
		;

		function refresh(){
			var style		= wnd.style,
			captions		= that.buttonCaptions;
			titlebox.innerHTML	= that.title;
			style.display		= (that.visible && that.state !== 4) ? 'block' : 'none';
			style.left		= that.left + 'px';
			style.top		= that.top + 'px';
			style.width		= that.width + 'px';
			style.height		= that.height + 'px';

			btnClose.style.display	= that.closeButton ? 'inline' : 'none';
			btnMinimize.style.display = that.minButton ? 'inline' : 'none';
			btnMaxRes.style.display = that.resizable ? 'inline' : 'none';

			btnClose.innerHTML	= captions[0];
			btnMaxRes.innerHTML	= that.state !== 3 ? captions[1] : captions[2];
			btnMinimize.innerHTML	= captions[3];
		}

		function close(force){
		}

		function minimize(){ // Add content here
		}


		function maximize(){ // Add content here
		}


		function move(left, top){
			if (left !== undefined){
				that.left = adapt(that.left, left);
				wnd.style.left = that.left + 'px';
			}
			if (top !== undefined){
				that.top = adapt(that.top, top);
				wnd.style.top = that.top + 'px';
			}
		}


		function resize(width, height){
			if (width !== undefined){
				that.width = adapt(that.width, width);
				wnd.style.width = that.width + 'px';
			}
			if (height !== undefined){
				that.height = adapt(that.height, height);
				wnd.style.height = that.height + 'px';
			}
		}

		appendChildren(wnd,		titlebar, contentbox			);
		appendChildren(titlebar,	titlebox, menubox, controlbox		);
		appendChildren(controlbox,	btnMinimize, btnMaxRes, btnMaxClose	);

		addClass(wnd,		'window'	);
		addClass(titlebar,	'titlebar'	);
		addClass(contentbox,	'content'	);
		addClass(controlbox,	'controls'	);
		addClass(menubox,	'menu'		);
		addClass(titlebox,	'title'		);
		addClass(btnClose,	'close'		);
		addClass(btnMaxRes,	'maximize'	);
		addClass(btnMinimize,	'minimize'	);

		btnClose.title = 'Close';
		btnClose.title = 'Minimize';

		bind(btnClose 'click', close);
		bind(titlebox, 'contextmenu', function(e){
			if (e.preventDefault){
				e.preventDefault();
			}
		});

		grab(titlebox, {
			onstart: function(e){
				if (typeof that.onmovestart === 'function'){
					that.onmovestart.call(this, e);
				}
			}, onmove: function(e){
				move('=' + e.move.x, '=' + e.move.y);
			}, onfinish: function(e){
				if (typeof that.onmovefinish === 'function'){
					that.onmovefinish.call(this, e);
				}
			}
		});

		grab(wnd, {
			onstart: function(e){
				var rightSide = (e.position.x > that.left + that.width - 5),
					bottomSide = (e.position.y > that.top + that.height - 5);
				if (!rightSide || !bottomSide)
					return true;
				if (typeof that.onresizestart === 'function'){
					that.onresizestart.call(this, e);
				}
			}, onmove: function(e){
				resize('=', e.move.x, '=', e.move.y);
			}, onfinish: function(e){
				if (typeof that.onresizefinish === 'function'){
					that.onresizefinish.call(this, e);
				}
			}
		});

		refresh();

		this.dom	= wnd;
		this.body	= contentbox;
		this.refresh	= refresh;
		this.close	= close;
		this.minimize	= minimize;
		this.maximize	= maximize;
		this.move	= move;
		this.resize	= resize;
	}

	function UISlider(options){
		if (this.constructor !== UIWindow){
			return new UISlider(options);
		}
	}

	function UIDial(options){
		if (this.constructor !== UIWindow){
			return new UIDial(options);
		}
	}

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
		appendChildren = Jin.appendChildren,
		create = Jin.create,
		settings = Jin.settings,
		UISettings = settings.UI = {},
		UIWindowDefaults = settings.UI.window {
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
			onmovestart: function(){
				addClass(document.body, 'moving');
			}, onmovefinish: function(){
				removeClass(document.body, 'moving');
			}, onresizestart: function(){
				addClass(document.body, 'resizing');
			}, onresizefinish: function(){
				removeClass(document.body, 'resizing');
			}
		}
	;

	Jin('window', UIWindow);
	Jin('slider', UISlider);
	Jin('dial', UIDial);
})(Jin);
