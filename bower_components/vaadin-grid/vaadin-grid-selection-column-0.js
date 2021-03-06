
  Polymer({
    is: 'vaadin-grid-selection-column',

    behaviors: [vaadin.elements.grid.ColumnBehavior],

    properties: {
      /**
       * Width of the cells for this column.
       */
      width: {
        type: String,
        value: '52px'
      },

      /**
       * Flex grow ratio for the cell widths. When set to 0, cell width is fixed.
       */
      flexGrow: {
        type: Number,
        value: 0
      },

      /**
       * When true it selects all the items.
       */
      selectAll: {
        type: Boolean,
        value: false,
        notify: true
      },

      /**
       * When true it adds the active item to selectedItems.
       */
      autoSelect: {
        type: Boolean,
        value: false,
      },

      _grid: Object,

      _indeterminate: Boolean,

      /*
       * The previous state of activeItem. When activeItem turns to `null`,
       * previousActiveItem will have an Object with just unselected activeItem
       */
      _previousActiveItem: Object,

      _selectAllHidden: Boolean
    },

    observers: [
      '_onSelectAllChanged(selectAll, _grid)'
    ],

    detached: function() {
      if (this._grid) {
        this.unlisten(this._grid, 'active-item-changed', '_onActiveItemChanged');
        this.unlisten(this._grid, 'data-provider-changed', '_onDataProviderChanged');
        this.unlisten(this._grid, 'filter-changed', '_onSelectedItemsChanged');
        this.unlisten(this._grid, 'selected-items-changed', '_onSelectedItemsChanged');
      }
    },

    attached: function() {
      this._grid = this._findGrid(this);
      if (this._grid) {
        this.listen(this._grid, 'active-item-changed', '_onActiveItemChanged');
        this.listen(this._grid, 'data-provider-changed', '_onDataProviderChanged');
        this.listen(this._grid, 'filter-changed', '_onSelectedItemsChanged');
        this.listen(this._grid, 'selected-items-changed', '_onSelectedItemsChanged');
      }
    },

    _headerTemplateChanged: function(headerTemplate) {
      // needed to override the dataHost correctly in case internal template is used.
      var templatizer = new vaadin.elements.grid.Templatizer(headerTemplate === this.$.defaultHeaderTemplate ? this : this.dataHost);
      templatizer._instanceProps = {};
      templatizer.template = headerTemplate;

      this.fire('property-changed', {path: 'headerTemplate', value: headerTemplate});
    },

    _findGrid: function(elm) {
      while (elm && elm.localName != 'vaadin-grid') {
        elm = elm.parentElement;
      }
      return elm || undefined;
    },

    _selectFirstTemplate: function(selector) {
      return Polymer.dom(this).querySelectorAll(selector)[0]
          || Polymer.dom(this.root).querySelectorAll(selector)[0];
    },

    _onSelectAllChanged: function(selectAll, grid) {
      if (this._selectAllChangeLock) {
        return;
      }

      grid.selectedItems = selectAll && grid.items ? grid._filter(grid.items) : [];
    },

    // Return true if array `a` contains all the items in `b`
    // We need this when sorting or to preserve selection after filtering.
    _arrayContains: function(a, b) {
      for (var i = 0; a && b && b[i] && a.indexOf(b[i]) >= 0; i++);
      return i == b.length;
    },

    _onSelectAll: function(e) {
      this.selectAll = this._indeterminate || !this.selectAll;
    },

    // iOS needs indeterminated + checked at the same time
    _isChecked: function(selectAll, indeterminate) {
      return indeterminate || selectAll;
    },

    _onActiveItemChanged: function(e) {
      var activeItem = e.detail.value;
      if (this.autoSelect) {
        var item = activeItem || this._previousActiveItem;
        this._grid._toggleItem(item);
      }
      this._previousActiveItem = activeItem;
    },

    _onSelectedItemsChanged: function(e) {
      this._selectAllChangeLock = true;
      if (this._grid.items) {
        if (!this._grid.selectedItems.length) {
          this.selectAll = false;
          this._indeterminate = false;
        } else if (this._arrayContains(this._grid.selectedItems, this._grid._filter(this._grid.items))) {
          this.selectAll = true;
          this._indeterminate = false;
        } else {
          this.selectAll = false;
          this._indeterminate = true;
        }
      }
      this._selectAllChangeLock = false;
    },

    _onDataProviderChanged: function(e) {
      this._selectAllHidden = !this._grid.items;
    }
  });
