L.ChangeFeatureGroupToolbar.Swapper = L.Handler.extend({
	statics: {
		TYPE: 'swapper'
	},

	includes: L.Mixin.Events,

	options: {},

	initialize: function (editToolbar, map, options) {
		L.Handler.prototype.initialize.call(this, map, options);
		this._nextId = 0;
		this._editToolbar = editToolbar;
		L.setOptions(this, options);
	},

	addHooks: function () {
		this._div = L.DomUtil.create('div', 'leaflet-draw-changefeaturegroup', this._map.getContainer());

		L.DomEvent.disableClickPropagation(this._div);

		if (this.options.featureGroups) {
			var form, ul, li, input, label, span, id;

			form = L.DomUtil.create('form', '', this._div);
			ul = L.DomUtil.create('ul', '', form);

			this._featureGroups = {};

			this.options.featureGroups.forEach(function (featureGroup) {
				id = 'leaflet-draw-changefeaturegroup-' + this._nextId++;

				li = L.DomUtil.create('li', '', ul);

				input = L.DomUtil.create('input', '', li);
				input.id = id;
				input.type = 'radio';
				input.name = 'changeFeatureGroup';

				label = L.DomUtil.create('label', '', li);
				label.innerHTML = featureGroup.title;
				label.setAttribute('for', id);

				this._featureGroups[id] = featureGroup.layer;
				L.DomEvent.on(input, 'change', this._onChangeInput, this);

			}, this);
		}
	},

	removeHooks: function () {
		this._div.remove();
	},

	_onChangeInput: function(e) {
		var featureGroup = this._featureGroups[e.target.id];

		if (featureGroup) {
			this._editToolbar.setFeatureGroup(featureGroup);
		}

		this.disable();
	}

});