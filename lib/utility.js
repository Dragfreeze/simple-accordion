define([
    'jquery',
    'modernizr'
], function ($) {
    'use strict';

    var version = '0.0.1';
    var mobileBreakpoint = '(max-width: 767px)';

    return {
        version: version,
        mobileBreakpoint: mobileBreakpoint,
        isMobile: function () {
            return Modernizr.mq(this.mobileBreakpoint);
        },
        isTouch: function () {
            return Modernizr.touch;
        }
    };
});