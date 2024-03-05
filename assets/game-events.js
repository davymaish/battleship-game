var gameEvents = {
  listeners: {},

  on: function(eventName, listener) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(listener);
  },

  off: function(eventName, listener) {
    var listeners = this.listeners[eventName] || [];
    this.listeners[eventName] = listeners.filter(function(item) {
      return item !== listener;
    });
  },

  emit: function(eventName, payload) {
    var listeners = this.listeners[eventName] || [];
    listeners.slice().forEach(function(listener) {
      listener(payload);
    });
  },

  clear: function() {
    this.listeners = {};
  }
};
