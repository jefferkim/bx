define(function(require, exports, module) {
  var $ = require('zepto'),
    effect = require('./effect.js')

  var $notification = $('#notification'),
  $actions = $notification.find('.actions'),
  $longMessage = $notification.find('.long-message'),
  $simpleMessage = $notification.find('.simple-message');


  return {
    show: function() {
      $notification.fadeIn(100)
    },

    hide: function() {
      $notification.fadeOut(200)
    },

    position: function() {
      $notification.css('opacity', '0').show()
      $notification.css('top', window.innerHeight / 2 - $notification.height() / 2)
      $notification.hide()
    },

    message: function(message, stay) {
      $notification.off()
      $actions.hide()
      $longMessage.hide()
      $simpleMessage.html(message).show()
      this.position()
      this.show()
      var self = this
      if (!stay) setTimeout(function() { self.hide() }, 1200)
    },

    alert: function(message, callback) {
      $notification.off()
      $actions.hide()
      $longMessage.hide()
      $simpleMessage.html(message).show()
    },

    confirm: function(message, confirmCallback, cancelCallback) {

    },

    external: function(url, confirmCallback, cancelCallback) {
      var self = this;
      $notification.off()
      $actions.find('.confirm').show()
      $actions.find('.cancel').show()
      $actions.find('.retry').hide()
      $actions.show()
      $simpleMessage.hide()
      $longMessage.find('.external').attr('href', url).text(url)
      $longMessage.show()
      $notification.on('click', '.confirm', function() {
        self.hide()
        confirmCallback && confirmCallback()
      })
      $notification.on('click', '.cancel', function() {
        self.hide();
        cancelCallback && cancelCallback()
      })
      this.position()
      this.show()
    }
  }

});