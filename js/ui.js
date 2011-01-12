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
			controlbox	= create(),

			btnClose	= create('button'),
			btnMaxRes	= create('button'),
			btnMinimize	= create('button');

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
		appendChildren(controlbox,	btnMinimize, btnMaxRes, btnMinimize	);

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

		bind(btnClose, 'click', close);
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
				if (!rightSide || !bottomSide){
					return true;
				}
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
		if (this.constructor !== UISlider){
			return new UISlider(options);
		}

		extend(this, UISliderDefaults, options);

		function setValueProperty(val){ // Forces a value, whether or not it is in range.
			var oldval = value;
			value = Math.round(val / that.step) * that.step;
			if (that.onchange && value !== oldval){
				that.onchange.call(this, value);
			}
			refresh();
		}

		function getValueProperty(){
			return value;
		}

		function setValue(val){ // Set's the value according to a range from 0 to 1, more efficient.
			if (val > 1){
				val = 1;
			} else if (val < 0){
				val = 0;
			}
			var	s	= that.maxValue - that.minValue,
				sv	= s * val,
				oldval	= value;
			value		= that.minValue + Math.round(sv / that.step) * that.step;
			if (that.onchange && value !== oldval){
				that.onchange.call(this, value);
			}
			refresh();
		}

		function getValue(){
			return (value - that.minValue) / (that.maxValue - that.minValue);
		}

		var	that		= this,
			dom		= create(),
			label		= create('label'),
			control		= create(),
			pointer		= create(),
			caption		= create(),
			value,
			horizontal	= that.direction === 'horizontal',
			refresh		= function(){
				dom.style.width		= that.width + 'px';
				dom.style.height	= that.height + 'px';
				if (horizontal){
					pointer.style.marginLeft = ( getValue() * that.width - pointer.offsetWidth / 2) + 'px';
				} else {
					pointer.style.marginTop = ( getValue() * that.height - pointer.offsetHeight / 2) + 'px';
				}
				label.innerHTML = that.title;
				if (that.valueArray){
					caption.innerHTML = that.valueArray[value];
				} else {
					caption.innerHTML = that.prefix + value + that.suffix;
				}
			};

		this.dom = dom;

		value = this.defValue;

		Object.defineProperty(this, 'value', {
			get: getValueProperty,
			set: setValueProperty
		});

		Jin(dom)
			.appendChildren(label, control, caption)
			.addClass('slider ' + this.direction);

		Jin(control)
			.appendChildren(pointer)
			.addClass('control')
			.grab({
				onstart: function(e){
					if (typeof that.onmovestart === 'function'){
						that.onmovefinish.call(this, e);
					}
				}, onmove: function(e){
					var offset = Jin.getOffset(dom);
					if (horizontal){
						setValue( (e.position.x - offset.left) / that.width );
					} else {
						setValue( (e.position.y - offset.top) / that.height );
					}
				}, onfinish: function(e){
					if (typeof that.onmovefinish === 'function'){
						that.onmovefinish.call(this, e);
					}
				}
			});

		addClass(pointer, 'pointer');

		that.setValue	= setValue; // Die, extend, die, you slow socks!
		that.getValue	= getValue;
		that.refresh	= refresh;

		refresh();
	}

	function UIDial(options){
		if (this.constructor !== UIDial){
			return new UIDial(options);
		}

		extend(this, UIDialDefaults, options);

		function setValueProperty(val){ // Forces a value, whether or not it is in range.
			var oldval = value;
			value = Math.round(val / that.step) * that.step;
			if (that.onchange && value !== oldval){
				that.onchange.call(this, value);
			}
			refresh();
		}

		function getValueProperty(){
			return value;
		}

		function setValue(val){ // Set's the value according to a range from 0 to 1, more efficient.
			if (val > 1){
				val = 1;
			} else if (val < 0){
				val = 0;
			}
			var	s	= that.maxValue - that.minValue,
				sv	= s * val,
				oldval	= value;
			value		= that.minValue + Math.round(sv / that.step) * that.step;
			if (that.onchange && value !== oldval){
				that.onchange.call(this, value);
			}
			refresh();
		}

		function getValue(){
			return (value - that.minValue) / (that.maxValue - that.minValue);
		}

		var	that		= this,
			dom		= create(),
			label		= create('label'),
			control		= create(),
			pointer		= create(),
			caption		= create(),
			value,
			refresh		= function(){
				dom.style.width		= that.width + 'px';
				dom.style.height	= that.height + 'px';

				var	angle		= -value * Math.PI * 2 - Math.PI * 1.5,
					width		= control.offsetWidth,
					height		= control.offsetHeight;

				pointer.style.marginLeft = ( ((Math.sin(angle) + 1) * width - pointer.offsetWidth) / 2) + 'px';
				pointer.style.marginTop = ( ((Math.cos(angle) + 1) * height - pointer.offsetHeight) / 2) + 'px';

				label.innerHTML = that.title;
				if (that.valueArray){
					caption.innerHTML = that.valueArray[value];
				} else {
					caption.innerHTML = that.prefix + value + that.suffix;
				}
			};

		this.dom = dom;

		value = this.defValue;

		Object.defineProperty(this, 'value', {
			get: getValueProperty,
			set: setValueProperty
		});

		Jin(dom)
			.appendChildren(label, control, caption)
			.addClass('dial');

		Jin(control)
			.appendChildren(pointer)
			.addClass('control')
			.grab({
				onstart: function(e){
					if (typeof that.onmovestart === 'function'){
						that.onmovefinish.call(this, e);
					}
				}, onmove: function(e){
					var	pi		= Math.PI,
						offset		= Jin.getOffset(control),
						angle		= pi + Math.atan2(
							offset.top + control.offsetHeight / 2 - e.position.y,
							offset.left + control.offsetWidth / 2 - e.position.x),
						val = angle / 2 / pi;
					setValue( val );
				}, onfinish: function(e){
					if (typeof that.onmovefinish === 'function'){
						that.onmovefinish.call(this, e);
					}
				}
			});

		addClass(pointer, 'pointer');

		that.setValue	= setValue; // Die, extend, die, you slow socks!
		that.getValue	= getValue;
		that.refresh	= refresh;

		refresh();
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
		UIWindowDefaults = settings.UI.window = {
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
		},
		UISliderDefaults = settings.UI.slider = {
			name: 'Slider',
			title: 'Parameter',
			width: 300,
			height: 20,
			minValue: 0,
			defValue: 0.5,
			maxValue: 1,
			step: 0.01,
			prefix: '',
			suffix: '',
			direction: 'horizontal',
			onmovestart: function(){
				addClass(document.body, 'moving');
			}, onmovefinish: function(){
				removeClass(document.body, 'moving');
			}
		},
		UIDialDefaults = settings.UI.dial = {
			name: 'Dial',
			title: 'Parameter',
			width: 300,
			height: 20,
			minValue: 0,
			defValue: 0.5,
			maxValue: 1,
			step: 0.01,
			prefix: '',
			suffix: '',
			clockwise: true,
			onmovestart: function(){
				addClass(document.body, 'moving');
			}, onmovefinish: function(){
				removeClass(document.body, 'moving');
			}
		};

	Jin('window', UIWindow);
	Jin('slider', UISlider);
	Jin('dial', UIDial);
})(Jin);
