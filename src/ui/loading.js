define(function(require, exports, module) {

    window.$ = require('zepto')

    var $loading = $('#loading')

    return {
      show: function() {
        this.position()
        $loading.show()
      },

      hide: function() {
        $loading.hide()
      },

      position: function() {
        $loading.css('opacity', '0').show()
        $loading.css('top', window.innerHeight / 2)
        $loading.hide().css('opacity', '1')
      }
    }

})