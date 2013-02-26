define(function(require, exports, module) {
  var $ = require('zepto');

  var $notification = $('#notification'),
  $actions = notification.find('.actions'),
  $longMessage = notification.find('.long-message'),
  $simpleMessage = notification.find('.simple-message');

  return {
    message: function(message) {
      $notification.off()
      $actions.hide()
      $longMessage.hide()
      $simpleMessage.html(message).show()

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

  return notification;
});