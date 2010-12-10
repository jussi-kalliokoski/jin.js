(function(document, Jin, undefined){
	Jin('tabs', function(options)
	{
		var opts = 
		{
			tabTitles: [],
			tabContents: []
			state: 0,
			left: 50,
			top: 0,
			width: 400,
			height: 300,
			closeButton: true,
			minButton: true,
			resizable: true,
			visible: true,
			onclose: undefined
		},
		tabs = new function JinTabs()
		{
			extend(this, opts, options);
			var i, tab, con,
				selector = createDiv(),
				contained = createDiv(),
				contentlayer = Jin.layer(),
				tablayer = Jin.layer;
			for (i=0; i < this.tabTitles.length; i++)
			{
				con = createDiv();
				tab = createElem('a');
				contentlayer.push(con);
				tablayer.push(tab);
				bind(tab, 'click', function (e)
				{
					if (e.preventDefault)
						e.preventDefault();
					showTab(this);
				});
				tab.href = '# Show ' + this.tabTitles[i];
			}

			this.showTab = showTab;

			function showTab()
			{
			}
		};
		return tabs;
	});

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
