L.DrawToolbar = L.Toolbar.extend({

	statics: {
		TYPE: 'draw'
	},

	options: {
		polyline: {},
		polygon: {},
		rectangle: {},
		circle: {},
		marker: {},
		featureGroup: undefined
	},

	initialize: function (options) {
		// Ensure that the options are merged correctly since L.extend is only shallow
		for (var type in this.options) {
			if (this.options.hasOwnProperty(type) && type !== 'featureGroup') {
				if (options[type]) {
					options[type] = L.extend({}, this.options[type], options[type]);
				}
			}
		}

		this._toolbarClass = 'leaflet-draw-draw';
		L.Toolbar.prototype.initialize.call(this, options);
	},

	getModeHandlers: function (map) {
		
		// dynamic
		
		var modeHandlers = [];
		
		for (var toolName in this.options) {
			if (this.options.hasOwnProperty(toolName) && toolName !== 'featureGroup') {
				var typeName = toolName[0].toUpperCase() + toolName.substring(1);
				if (L.Draw[typeName]) {
					
					var Type = L.Draw[typeName];

					modeHandlers.push({
						enabled: this.options[toolName],
						handler: new Type(map, this.options[toolName]),
						title: L.drawLocal.draw.toolbar.buttons[toolName]
					});
				}
			}
		}

		return modeHandlers;
	},

	// Get the actions part of the toolbar
	getActions: function (handler) {

		// legacy
		
		var actions = [
			{
				enabled: handler.deleteLastVertex,
				title: L.drawLocal.draw.toolbar.undo.title,
				text: L.drawLocal.draw.toolbar.undo.text,
				callback: handler.deleteLastVertex,
				context: handler
			},
			{
				title: L.drawLocal.draw.toolbar.actions.title,
				text: L.drawLocal.draw.toolbar.actions.text,
				callback: this.disable,
				context: this
			}
		];

		if (handler.getActions) {
			// if handler has own custom actions
			var customActions = handler.getActions();
			if (customActions) {
				actions.unshift.apply(actions, customActions);
			}
		}

		return actions;
	},

	setOptions: function (options) {
		L.setOptions(this, options);

		for (var type in this._modes) {
			if (this._modes.hasOwnProperty(type) && options.hasOwnProperty(type) && type !== 'featureGroup') {
				this._modes[type].handler.setOptions(options[type]);
			}
		}
	},

	addToolbar: function (map) {

		var container = L.Toolbar.prototype.addToolbar.call(this, map);

		this._checkDisabled();

		this._map.on('draw:featuregroupchanged', this.setFeatureGroup, this);

		return container;

	},

	setFeatureGroup: function (evt) {

		if (!evt.featureGroup || evt.featureGroup.layer === this.options.featureGroup) {
			return;
		}

		this.options.featureGroup = evt.featureGroup;

		this._checkDisabled();

	},

	_checkDisabled: function () {

		var featureGroup = this.options.featureGroup;
		var	button;
		var handler;

		for (var type in this._modes) {
			if (this._modes.hasOwnProperty(type) && type !== 'featureGroup') {

				button = this._modes[type].button;
				handler = this._modes[type].handler;

				if (featureGroup) {
					L.DomUtil.removeClass(button, 'leaflet-disabled');
					button.setAttribute('title', L.drawLocal.draw.toolbar.buttons[type]);
					L.DomEvent.on(button, 'click', handler.enable, handler);
				} else {
					L.DomUtil.addClass(button, 'leaflet-disabled');
					button.removeAttribute('title');
					L.DomEvent.off(button, 'click', handler.enable);
				}

			}

		}

	}

});
