L.Control.Draw = L.Control.extend({

	options: {
		position: 'topleft',
		draw: {},
		edit: false,
		featureGroup: undefined
	},

	initialize: function (options) {
		if (L.version < '0.7') {
			throw new Error('Leaflet.draw 0.2.3+ requires Leaflet 0.7.0+. Download latest from https://github.com/Leaflet/Leaflet/');
		}

		L.Control.prototype.initialize.call(this, options);

		var toolbar = null;

		// Initialize toolbars
		this._toolbars = {};

		// Change featureGroup
		if (L.ChangeFeatureGroupToolbar && this.options.changeFeatureGroup) {

			if (this.options.featureGroup) {
				this.options.changeFeatureGroup.featureGroup = this.options.featureGroup;
			}

			toolbar = new L.ChangeFeatureGroupToolbar(this.options.changeFeatureGroup);
			
			this._toolbars[L.ChangeFeatureGroupToolbar.TYPE] = toolbar;

			// Listen for when toolbar is enabled
			this._toolbars[L.ChangeFeatureGroupToolbar.TYPE].on('enable', this._toolbarEnabled, this);

		}

		// Draw Tools
		if (L.DrawToolbar && this.options.draw) {

			if (this.options.featureGroup) {
				this.options.draw.featureGroup = this.options.featureGroup;
			}

			toolbar = new L.DrawToolbar(this.options.draw);

			this._toolbars[L.DrawToolbar.TYPE] = toolbar;

			// Listen for when toolbar is enabled
			this._toolbars[L.DrawToolbar.TYPE].on('enable', this._toolbarEnabled, this);

		}

		// Edit tools
		if (L.EditToolbar && this.options.edit) {

			if (this.options.featureGroup) {
				this.options.edit.featureGroup = this.options.featureGroup;
			}

			toolbar = new L.EditToolbar(this.options.edit);

			this._toolbars[L.EditToolbar.TYPE] = toolbar;

			// Listen for when toolbar is enabled
			this._toolbars[L.EditToolbar.TYPE].on('enable', this._toolbarEnabled, this);

		}

	},

	onAdd: function (map) {
		var container = L.DomUtil.create('div', 'leaflet-draw'),
			addedTopClass = false,
			topClassName = 'leaflet-draw-toolbar-top',
			toolbarContainer;

		for (var toolbarId in this._toolbars) {
			if (this._toolbars.hasOwnProperty(toolbarId)) {
				toolbarContainer = this._toolbars[toolbarId].addToolbar(map);

				if (toolbarContainer) {
					// Add class to the first toolbar to remove the margin
					if (!addedTopClass) {
						if (!L.DomUtil.hasClass(toolbarContainer, topClassName)) {
							L.DomUtil.addClass(toolbarContainer.childNodes[0], topClassName);
						}
						addedTopClass = true;
					}

					container.appendChild(toolbarContainer);
				}
			}
		}

		return container;
	},

	onRemove: function () {
		for (var toolbarId in this._toolbars) {
			if (this._toolbars.hasOwnProperty(toolbarId)) {
				this._toolbars[toolbarId].removeToolbar();
			}
		}
	},

	showButton: function (type, toggleClass) {
		this._toggleButton({
			showing: true,
			type: type,
			toggleClass: toggleClass // class to remove to show the element
		});
	},

	hideButton: function (type, toggleClass) {
		this._toggleButton({
			showing: false,
			type: type,
			toggleClass: toggleClass // class to add to hide the element
		});
	},

	setDrawingOptions: function (options) {
		for (var toolbarId in this._toolbars) {
			if (this._toolbars[toolbarId] instanceof L.DrawToolbar) {
				this._toolbars[toolbarId].setOptions(options);
			}
		}
	},

	_toolbarEnabled: function (e) {
		var enabledToolbar = e.target;

		for (var toolbarId in this._toolbars) {
			if (this._toolbars[toolbarId] !== enabledToolbar) {
				this._toolbars[toolbarId].disable();
			}
		}
	},

	_toggleButton: function (options) {
		// loop over the toolbars to find the right buttons
		for (var toolbarId in this._toolbars) {
			if (this._toolbars.hasOwnProperty(toolbarId)) {
				if (this._toolbars[toolbarId].toggleButton) {
					this._toolbars[toolbarId]._toggleButton(options);
				}
			}
		}
	}
});

L.Map.mergeOptions({
	drawControlTooltips: true,
	drawControl: false
});

L.Map.addInitHook(function () {
	if (this.options.drawControl) {
		this.drawControl = new L.Control.Draw();
		this.addControl(this.drawControl);
	}
});
