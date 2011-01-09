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
				
			}
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
