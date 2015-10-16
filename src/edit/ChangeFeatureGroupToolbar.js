L.ChangeFeatureGroupToolbar = L.Toolbar.extend({

	statics: {
		TYPE: 'changeFeatureGroup'
	},

	options: {},

	initialize: function (editToolbar, options) {
		L.Toolbar.prototype.initialize.call(this, options);
		L.setOptions(this, options);
		this._editToolbar = editToolbar;
		this._toolbarClass = 'leaflet-change';
	},

	getModeHandlers: function (map) {
		return [
			{
				enabled: true,
				handler: new L.ChangeFeatureGroupToolbar.Swapper(this._editToolbar, map, this.options),
				title: L.drawLocal.change.toolbar.swapper
			}
		];
	}

});