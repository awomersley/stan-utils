/* ========================================================================
 * STAN Plugins: StickyFix
 * Author Andrew Womersley
 * ======================================================================== */

(function($, $STAN) {

    'use strict';

    // Define Global Vars
    var Selectors = [];

    // Resize Listener for resizing slideshow height
    $(window).resize(function() {

        if (!Selectors.length) return;

        $(Selectors).each(function() {

            methods.stick.apply(this);

        });

    }).resize();

    $(window).scroll(function() {

        if (!Selectors.length) return;

        $(Selectors).each(function() {

            methods.stick.apply(this);

        });

    }).scroll();


    // Define Methods
    var methods = {

        init: function(options) {

            var $this = this;

            // Set Options
            var settings = $.extend({
                top: 0,
                maxtop: false,
                sticky_class: '',
                stick_to: 'window',
                devices: {
                    xs: true,
                    sm: true,
                    md: true,
                    lg: true
                },
                _css:{
                    top: $this.css('top'),
                    position: $this.css('position'),
                    zindex: $this.css('z-index')
                },
                _status: 'unstuck'
            }, options);

            // Save selector in array
            Selectors.push(this.selector);

            // Iterate Through Selectors
            return this.each(function(index) {

                var placeholder = "sticky-" + $this.selector.substring(1) + "-" + index;

                $(this).after("<div class='sticky-placeholder' id='" + placeholder + "' style='display:none;height:" + $(this).height() + "px;'></div>");

                // Set Data
                settings.offset = $(this).offset();
                settings.placeholder = '#' + placeholder;

                // Save settings
                $(this).data('StickyFix', settings);

            });

        },

        stick: function() {

            var settings = $(this).data('StickyFix');

            var t = settings.offset.top - $(window).scrollTop();

            var maxtop;
            var pos;

            if (t < settings.top && settings.devices[$STAN.device]) {

                if (typeof settings.maxtop === 'function') maxtop = settings.maxtop();
                else if (typeof settings.maxtop === 'number') maxtop = settings.maxtop;
                else maxtop = 99999;

                if ($(window).scrollTop() > maxtop) {

                    pos = settings.top - ($(window).scrollTop() - maxtop);
                    $(this).css('top', pos + 'px');

                }
                else {

                    // Trigger
                    if (settings._status == 'unstuck') $(this).trigger('stuck.sa.stickyfix', [settings]);

                    $(this).addClass(settings.sticky_class).css({
                        'z-index': 999,
                        top: settings.top + 'px',
                        position: 'fixed'
                    });

                    settings._status='stuck';

                    $(settings.placeholder).css('display', 'block');

                    if (settings.stick_to == 'parent') $(this).css({
                        width: $(settings.placeholder).width() + 'px',
                        left: $(settings.placeholder).offset().left + 'px'
                    });

                }

            }
            else {

                // Trigger
                if (settings._status == 'stuck') $(this).trigger('unstuck.sa.stickyfix', [settings]);

                $(this).removeClass(settings.sticky_class).css({
                    top: settings._css.top,
                    position: settings._css.position,
                    'z-index': settings._css.zindex
                });

                settings._status='unstuck';

                $(settings.placeholder).css('display', 'none');

                if (settings.stick_to == 'parent') $(this).css({
                    width: 'auto',
                    left: 'auto'
                });

            }

        }

    };

    $.fn.StickyFix = function(method) {

        if (methods[method]) {

            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));

        }
        else if (typeof method === 'object' || !method) {

            return methods.init.apply(this, arguments);

        }
        else {

            $.error('Method ' + method + ' does not exist on jQuery.Datatable');

        }

    };

}(jQuery, $STAN));