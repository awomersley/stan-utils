/* ========================================================================
 * STAN Utils: Stan
 * Author: Andrew Womersley
 * ======================================================================== */

(function($STAN, CustomConfig) {

  'use strict';

  var Tag = !!CustomConfig.tag ? CustomConfig.tag : 'body';

  var Config = {

    xs: {
      min_width: 0,
      classes: 'device-xs mobile',
      data: {
        mobile: true,
        desktop: false
      }
    },
    sm: {
      min_width: 768,
      classes: 'device-sm mobile',
      data: {
        mobile: true,
        desktop: false
      }
    },
    md: {
      min_width: 992,
      classes: 'device-md desktop',
      data: {
        mobile: false,
        desktop: true
      }
    },
    lg: {
      min_width: 1200,
      classes: 'device-lg desktop',
      data: {
        mobile: false,
        desktop: true
      }
    }

  };

  // Merge Config with CustomConfig
  for (var i in Config) {
    if (typeof CustomConfig[i] === 'object') Config[i] = $.extend(Config[i], CustomConfig[i]);
  }

  // Set Max Widths
  Config.xs.max_width = Config.sm.min_width;
  Config.sm.max_width = Config.md.min_width;
  Config.md.max_width = Config.lg.min_width;
  Config.lg.max_width = 9999;


  var _STAN = function() { //deferTrigger

    var device;
    var current_device;
    var triggers = [];
    var x;
    var bp;
    var ww;
    var wh;

    // Loop through breakpoints - reset data
    for (device in Config) {

      bp = Config[device];

      // Remove classes - moved below
      $(Tag).removeClass(bp.classes);

      // Remove data attributes
      for (x in bp.data) $STAN[x] = false;

    }

    current_device = $STAN.device;

    // Loop through breakpoints - set data
    for (device in Config) {

      bp = Config[device];

      ww = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      wh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

      $STAN.windowWidth = ww;
      $STAN.windowHeight = wh;

      if (bp.min_width <= ww && ww < bp.max_width) {

        // Add class
        $(Tag).addClass(bp.classes);

        if (current_device != device) triggers.push({
          type: 'active',
          device: device
        });

        // Add attributes
        $STAN.device = device;
        $STAN.classes = bp.classes;
        for (x in bp.data) $STAN[x] = bp.data[x];

      } else {

        if (current_device == device) triggers.push({
          type: 'deactive',
          device: device
        });

      }

    }

    $STAN.Tag = Tag;


    // Init triggers
    for (var i in triggers) {
      var trigger = triggers[i];
      $STAN.trigger('breakpoint.' + trigger.type, trigger.device);
    }

  };

  var _STAN_Resize = function() {

    var ww = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var wh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    if (ww != $STAN.windowWidth || wh != $STAN.windowHeight) {

      _STAN();
      $STAN.trigger('window.resize');

    }

  };

  // Set resize listener
  var timer;
  $(window).on('resize orientationchange', function() {
    window.clearTimeout(timer);
    timer = window.setTimeout(_STAN_Resize, 100);
  });

  // Run
  _STAN();


})($STAN, ((typeof $STAN_Config === 'undefined') ? [] : $STAN_Config));
