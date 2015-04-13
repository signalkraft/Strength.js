/*!
 * strength.js
 * Original author: @aaronlumsden
 * Further changes, comments: @aaronlumsden, github.com/signalkraft
 * Licensed under the MIT license
 */
;
(function ($, window, document, undefined) {

    var pluginName = "strength",
        defaults = {
            strengthClass: 'strength'
        };

    function Plugin(element, options) {
        this.element = element;
        this.$elem = $(this.element);
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {
        init: function () {
            var characters = 0;
            var capitalletters = 0;
            var lowerletters = 0;
            var number = 0;

            var upperCase = new RegExp('[A-Z]');
            var lowerCase = new RegExp('[a-z]');
            var numbers = new RegExp('[0-9]');

            var strengths = ['very-weak', 'weak', 'medium', 'strong', 'very-strong'];

            function calculateStrength($elem) {
                var value = $elem.val();
                if (value.length >= 8) {
                    characters = 1;
                } else {
                    characters = -1;
                }
                if (value.match(upperCase)) {
                    capitalletters = 1
                } else {
                    capitalletters = 0;
                }
                if (value.match(lowerCase)) {
                    lowerletters = 1
                } else {
                    lowerletters = 0;
                }
                if (value.match(numbers)) {
                    number = 1
                } else {
                    number = 0;
                }

                var total = characters + capitalletters + lowerletters + number;

                if (!value.length) {
                    total = -1;
                }

                return total;
            }

            function setClasses($elem, total) {
                if (total > -1) {
                    var strength = strengths[total];
                    var unused = strengths.filter(function(x) {
                        if (x != strength) {
                            return x;
                        }
                    });

                    $elem.addClass(strength).data('password-strength', strength);
                    $elem.removeClass(unused.join(' '));
                } else {
                    $elem.removeClass(strengths.join(' '));
                    $elem.removeData('password-strength');
                }
            }

            var $elem = this.$elem;

            this.$elem.bind('keyup keydown', function (event) {
                var strength = calculateStrength($elem);
                setClasses($elem, strength);
            });

            this.$elem.addClass(this.options.strengthClass);
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);


