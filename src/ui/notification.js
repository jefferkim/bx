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
      $notification.css('top', window.innerHeight / 2 - $notification.height() / 2)
    },

    message: function(message) {
      $notification.off()
      $actions.hide()
      $longMessage.hide()
      $simpleMessage.html(message).show()
      this.position()
      this.show()
      var self = this
      setTimeout(function() { self.hide() }, 1200)
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

    }
  }

});