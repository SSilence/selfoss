/**
 * initialize events for entries
 */
selfoss.events.entries = function() {

    $('.entry, .entry-title').unbind('click');

    // clear the selected entry
    selfoss.ui.entrySelect(null);

    // show/hide entry
    var target = selfoss.isMobile() ? '.entry' : '.entry-title';
    $(target).click(function() {
        var parent = ((target == '.entry') ? $(this) : $(this).parent());

        // prevent event on fullscreen touch
        if (document.body.classList.contains('fullscreen-mode')) {
            return;
        }

        var autoMarkAsRead = $('body').hasClass('loggedin') && $('#config').data('auto_mark_as_read') == '1' && parent.hasClass('unread');
        var autoHideReadOnMobile = $('#config').data('auto_hide_read_on_mobile') == '1' && parent.hasClass('unread');

        // anonymize
        selfoss.anonymize(parent.find('.entry-content'));

        var entryId = parent.attr('data-entry-id');

        var entryContent = parent.find('.entry-content');

        // show entry in popup
        if (selfoss.isSmartphone()) {
            // save scroll position
            var scrollTop = $(window).scrollTop();

            // hide nav
            if ($('#nav').is(':visible')) {
                scrollTop = scrollTop - $('#nav').height();
                scrollTop = scrollTop < 0 ? 0 : scrollTop;
                $(window).scrollTop(scrollTop);
                $('#nav').hide();
            }

            // show fullscreen
            document.body.classList.add('fullscreen-mode');
            selfoss.ui.entrySelect(parent);
            selfoss.ui.entryExpand(parent);
            selfoss.events.setHash('same', 'same', entryId);
            selfoss.events.entriesToolbar(parent);

            parent.attr('aria-modal', 'true');

            if ($('#config').data('load_images_on_mobile') == '1') {
                parent.find('.entry-loadimages').hide();
                entryContent.lazyLoadImages();
            }

            $.trapKeyboard(parent);

            // set events for closing fullscreen
            var closeTargets = $().add(parent).add(parent.find('.entry-close'));
            var parentNative = parent.get(0);
            parentNative.closeFullScreen = function(e) {
                // can be called by other things
                if (e) {
                    e.stopPropagation();

                    // do not exit fullscreen when clicking link
                    if (e.target.tagName.toLowerCase() == 'a') {
                        return;
                    }
                }

                document.body.classList.remove('fullscreen-mode');

                selfoss.ui.entryCollapse(parent);
                selfoss.events.setHash();

                if (autoHideReadOnMobile && (parent.hasClass('unread') == false)) {
                    parent.hide();
                }

                parent.attr('aria-modal', 'false');

                $.untrapKeyboard();

                closeTargets.off('click', parentNative.closeFullScreen);
                parentNative.closeFullScreen = null;

                $(window).scrollTop(scrollTop);
            };
            closeTargets.click(parentNative.closeFullScreen);

            // automark as read
            if (autoMarkAsRead) {
                parent.find('.entry-unread').click();
            }
        // open entry content
        } else {
            // show/hide (with toolbar)
            if (selfoss.ui.entryIsExpanded(parent)) {
                selfoss.ui.entryCollapse(parent);
                selfoss.events.setHash();
            } else {
                if ($('#config').data('auto_collapse') == '1') {
                    selfoss.ui.entryCollapseAll();
                }
                selfoss.ui.entrySelect(parent);
                selfoss.ui.entryExpand(parent);
                selfoss.events.setHash('same', 'same', entryId);
                selfoss.events.entriesToolbar(parent);

                // automark as read
                if (autoMarkAsRead) {
                    parent.find('.entry-unread').click();
                }

                // setup fancyBox image viewer
                selfoss.setupFancyBox(entryContent, parent.attr('id').substr(5));

                // scroll to article header
                if ($('#config').data('scroll_to_article_header') == '1') {
                    parent.get(0).scrollIntoView();
                }

                // turn of column view if entry is too long
                if (entryContent.height() > $(window).height()) {
                    entryContent.addClass('entry-content-nocolumns');
                }
            }

            // load images not on mobile devices
            if (selfoss.isMobile() == false || $('#config').data('load_images_on_mobile') == '1') {
                entryContent.lazyLoadImages();
            }
        }
    });

    // no source click
    if (selfoss.isSmartphone()) {
        $('.entry-icon, .entry-datetime').unbind('click').click(function(e) {
            e.preventDefault();
            return false;
        });
    }

    // scroll load more
    $(window).unbind('scroll').scroll(function() {
        if ($('#config').data('auto_stream_more') == 0 ||
           $('#content').is(':visible') == false) {
            return;
        }

        if ($('.stream-more').is(':visible')
           && $('.stream-more').position().top < $(window).height() + $(window).scrollTop()
           && $('.stream-more').hasClass('loading') == false) {
            $('.stream-more').click();
        }
    });

    $('.mark-these-read').unbind('click').click(selfoss.markVisibleRead);

    $('.stream-error').unbind('click').click(selfoss.db.reloadList);

    // more
    $('.stream-more').unbind('click').click(function() {
        var lastEntry = $('.entry').filter(':last');
        selfoss.events.setHash();
        selfoss.filter.extraIds.length = 0;
        selfoss.filter.fromDatetime = lastEntry.data('entry-datetime');
        selfoss.filter.fromId = lastEntry.data('entry-id');

        selfoss.db.reloadList(true);
    });

    // click a source
    if (selfoss.isSmartphone() == false) {
        $('.entry-source').unbind('click').click(function() {
            var entry = $(this).parents('.entry');
            selfoss.events.setHash('same',
                'source-' + entry.attr('data-entry-source'));
        });
    }

    // click a tag
    if (selfoss.isSmartphone() == false) {
        $('.entry-tags-tag').unbind('click').click(function() {
            var tag = $(this).html();
            $('#nav-tags .tag').each(function(index, item) {
                if ($(item).html() == tag) {
                    $(item).click();
                    return false;
                }
            });
        });
    }

    // updates a source
    $('#refresh-source').unbind('click').click(function() {
        // show loading
        var content = $('#content');
        var articleList = content.html();
        $('#content').addClass('loading').html('');

        $.ajax({
            url: $('base').attr('href') + 'source/' + selfoss.filter.source + '/update',
            type: 'POST',
            dataType: 'text',
            data: {},
            success: function() {
                // hide nav on smartphone
                if (selfoss.isSmartphone()) {
                    $('#nav-mobile-settings').click();
                }
                // refresh list
                selfoss.db.reloadList();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                content.html(articleList);
                $('#content').removeClass('loading');
                alert($('#lang').data('error_refreshing_source') + ' ' + errorThrown);
            },
            timeout: 0
        });
    });

    // open selected entry only if entry was requested (i.e. if not streaming
    // more)
    if (selfoss.events.entryId && selfoss.filter.fromId === undefined) {
        var entry = $('#entry' + selfoss.events.entryId);
        selfoss.ui.entryActivate(entry);
        // ensure scrolling to requested entry even if scrolling to article
        // header is disabled
        if ($('#config').data('scroll_to_article_header') == '0') {
            // needs to be delayed for some reason
            requestAnimationFrame(function() {
                entry.get(0).scrollIntoView();
            });
        }
    }
};
