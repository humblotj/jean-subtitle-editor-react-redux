const EventEmitter = {
  _events: {},
  dispatch: function(event, data) {
    if (!this._events[event]) return;
    this._events[event].forEach(callback => callback(data));
  },
  subscribe: function(event, callback) {
    if (!this._events[event]) this._events[event] = [];
    this._events[event].push(callback);
  },
  removeListener(event, callback) {
    // remove listeners
    if (this._events[event].length) {
      const index = this._events[event].indexOf(callback);
      if (index) {
        delete this._events[event][index];
      }
    }
  }
};

module.exports = { EventEmitter };
