/*
 * Simple Accordion
 *
 * @license MIT
 * @version 0.1
 * @updated 2016-06-17
 * @author  Dragfreeze
 * @link    simple-accordion.com
 *
 */

define([
    'jquery',
    'utility',
    'jqueryui'
], function ($, utility) {
    'use strict';

    $.widget('dfz.simpleAccordion', {
        options: {
            headerSelector: '.title',
            contentSelector: '.content',
            slideSpeed: 300,
            activeClass: 'active',
            activeElements: [0],
            multipleCollapsible: false,
            disableForDesktop: false,
            disableForMobile: false,
            mobileOptions: {},
            searchForNestedSections: true, /* Automatically looks for nested sections */
            fluid: true, /* Set options automatically on mobile | desktop breakpoint changes */
            debugMode: true,
            smartMode: true
        },
        _create: function () {
            var self = this;

            if ((self.options.disableForDesktop && !utility.isMobile()) || (self.options.disableForMobile && utility.isMobile())) {
                return;
            }

            self._checkBreakpoint();
            self._initialize();
            self._bindEvents();

        },

        _checkBreakpoint: function () {
            var self = this;
            if (utility.isMobile()) {
                for (var prop in self.options.mobileOptions) {
                    if (!self.options.mobileOptions.hasOwnProperty(prop)) {
                        /* The current property is not a direct property of prop */
                        continue;
                    }
                    self.options[prop] = self.options.mobileOptions[prop];
                }
            }
        },

        _initialize: function () {
            var self = this;
          
            self._assignRoles();
            
            /* Hide all content on load. */
            self.content.hide();
            if (self.options.activeElements) {
                /* activate active elements */
                self.options.activeElements.forEach(function(item) {
                    var activeHeader = self.header.eq(item);
                    if (activeHeader.length) {
                        // self._showContent(activeHeader, true);
                        self._toggleContent(true, activeHeader, true);
                    }
                });
            }
        },

        _assignRoles: function () {
            var self = this;

            self.header = $(self.options.headerSelector).addClass(self.options.headerSelector.substring(1) + '-dfz');
            self.content = $(self.options.contentSelector).addClass(self.options.contentSelector.substring(1) + '-dfz');

            if (!self.header.length || self.options.smartMode) {
                self.options.debugMode && console.warn('Accordion header sections not set');
                self.header = self.element.children().children(':first-child').addClass(self.options.headerSelector.substring(1) + '-dfz');
                self.content = self.content.add(self.header.siblings().addClass(self.options.contentSelector.substring(1) + '-dfz'));
            }

            self.options.searchForNestedSections && self._checkForNestedSections(self.content);
            
        },

        _checkForNestedSections: function (contentSection) {
            var self = this;
            contentSection.each(function () {
                $(this).children().each(function () {
                    var $this = $(this);
                    if ($this.children().length === 2) {
                        self.header = self.header.add($this.children(':first-child').addClass(self.options.headerSelector.substring(1) + '-dfz'));

                        var content = $this.children(':last-child').addClass(self.options.contentSelector.substring(1) + '-dfz');
                        self._checkForNestedSections(content);
                        self.content = self.content.add(content);                        
                    }
                });
            });
        },

        _bindEvents: function () {
            var self = this;
            self.header.on('click.dfz', function(event) {
                event.preventDefault();
                var $this = $(this);
                var eligibleHeaders;
                if (!$this.hasClass('active')) {
                    /* Show content */
                    self._toggleContent(true, $this);
                    if (!self.options.multipleCollapsible) {
                        eligibleHeaders = $this.parent().siblings().find(self.options.headerSelector + '-dfz');
                        self._toggleContent(false, eligibleHeaders);
                    }
                } else {
                    /* Hide content */
                    eligibleHeaders = $this.siblings().find(self.options.headerSelector + '-dfz').add($this);
                    self._toggleContent(false, eligibleHeaders);
                }
            });
        },

        _toggleContent: function (action, headerElements, immidiate) {
            var self = this;
            headerElements.each(function() {
                var header = $(this);
                var content = header.siblings(self.options.contentSelector + '-dfz');

                if (immidiate) {
                    content
                        .stop()
                        [action ? 'show' : 'hide']();
                } else {
                    content
                        .stop()
                        [action ? 'slideDown' : 'slideUp'](self.options.slideSpeed);
                }

                header.add(header.parent())[action ? 'addClass' : 'removeClass'](self.options.activeClass);
            });
        },

        showAll: function (immidiate) {
            var self = this;
            self._toggleContent(this, self.header, immidiate);
        },

        hideAll: function (immidiate) {
            var self = this;
            self._toggleContent(false, self.header, immidiate);
        },

        destroy: function () {
            var self = this;
            self.header.off('click.dfz');
            self.element.find(self.options.headerSelector + '-dfz').removeClass(self.options.headerSelector.substring(1) + '-dfz');
            self.element.find(self.options.contentSelector + '-dfz').removeClass(self.options.contentSelector.substring(1) + '-dfz');
        }
    });

    return $.dfz.simpleAccordion;
});