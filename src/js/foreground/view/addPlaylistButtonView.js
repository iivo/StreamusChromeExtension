﻿define([
    'foreground/view/listItemButtonView',
    'text!template/addListItemButton.html'
], function (ListItemButtonView, AddListItemButtonTemplate) {
    'use strict';

    var StreamItems = Streamus.backgroundPage.StreamItems;

    var AddPlaylistButtonView = ListItemButtonView.extend({
        template: _.template(AddListItemButtonTemplate),

        events: {
            'click': '_onClick',
            'dblclick': '_onClick'
        },
        
        initialize: function () {
            this.listenTo(this.model.get('items'), 'add remove reset', this._setTitleAndDisabledClass);
        },

        onRender: function () {
            this._setTitleAndDisabledClass();
        },
        
        _setTitleAndDisabledClass: function () {
            var empty = this.model.get('items').length === 0;
            this.$el.toggleClass('disabled', empty);

            var title = empty ? chrome.i18n.getMessage('playlistEmpty') : chrome.i18n.getMessage('add');
            this.$el.attr('title', title);
        },
        
        _onClick: function () {
            if (this.model.get('items').length > 0) {
                this._addSongs();
            }
            
            //  Don't allow event to bubble up because click event will cause it to be selected.
            return false;
        },
        
        _addSongs: _.debounce(function () {
            StreamItems.addSongs(this.model.get('items').pluck('song'));
        }, 100, true)
    });

    return AddPlaylistButtonView;
});