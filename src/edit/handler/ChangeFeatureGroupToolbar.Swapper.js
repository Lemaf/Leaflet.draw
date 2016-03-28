L.ChangeFeatureGroupToolbar.Swapper = L.Handler.extend({
	statics: {
		TYPE: 'swapper'
	},

	includes: L.Mixin.Events,

	options: {
		featureGroup: null
	},

	initialize: function (map, options) {
		L.Handler.prototype.initialize.call(this, map, options);
		this._nextId = 0;
		this.type = L.ChangeFeatureGroupToolbar.Swapper.TYPE;
		L.setOptions(this, options);
	},

	addHooks: function () {
		this._div = L.DomUtil.create('div', 'leaflet-draw-changefeaturegroup', this._map.getContainer());

		L.DomEvent
			.on(this._div, 'click', L.DomEvent.stopPropagation)
			.on(this._div, 'mousemove', L.DomEvent.stopPropagation)
			.on(this._div, 'mousewheel', L.DomEvent.stopPropagation)
			.on(this._div, 'mousedown', L.DomEvent.stopPropagation)
			.on(this._div, 'dblclick', L.DomEvent.stopPropagation);

		if (this.options.featureGroups) {
			var form, ul, li, label, id, link;

			form = L.DomUtil.create('form', '', this._div);
			ul = L.DomUtil.create('ul', '', form);

			var liTitle = L.DomUtil.create('li', 'title', ul);
			liTitle.textContent = this.options.title || '';

			this._featureGroups = {};

			this.options.featureGroups.forEach(function (featureGroup) {
				id = 'leaflet-draw-changefeaturegroup-' + this._nextId++;

				li = L.DomUtil.create('li', '', ul);
				li._featureGroupID = id;
				
				if (this.options.featureGroup && featureGroup.layer === this.options.featureGroup.layer) {
					L.DomUtil.addClass(li, 'selected');
				}

				label = L.DomUtil.create('span', '', li);
				label.textContent = featureGroup.title;

				L.DomEvent
					.on(li, 'click', this._onItemClick, this);

				this._featureGroups[id] = featureGroup;

			}, this);

			li = L.DomUtil.create('li', '', ul);
			link = L.DomUtil.create('a', '', li);
			link.innerHTML = L.drawLocal.change.cancel;

			L.DomEvent.on(link, 'click', this.disable, this);
		}
	},

	removeHooks: function () {
		this._div.remove();
	},

	_onItemClick: function (e) {
		L.DomEvent.stopPropagation(e);

		this.options.featureGroup = this._featureGroups[e.currentTarget._featureGroupID];
		this._map.fire('draw:featuregroupchanged', {featureGroup: this.options.featureGroup});
		this.disable();

	}

});