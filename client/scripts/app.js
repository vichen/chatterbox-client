// YOUR CODE HERE:

var App = function() {};

App.prototype.clearMessages = function() {
  $('#chats').html('');
};
App.prototype.server = 'https://api.parse.com/1/classes/messages';

App.prototype.addRoom = function(roomName) {
  $('#roomSelect').append('<div><h3>' + roomName + '</h3></div>');
};

App.prototype.addMessage = function(message) {
  var chatItem = $('div').
  $('#chats').append('<div class="message">' + message.text + '</div>');
};

App.prototype.init = function() {
  this.fetch();
};

App.prototype.fetch = function() {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: this.server,
    type: 'GET',
    // data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Messages retrieved.');
      this.clearMessages();
      data.results.forEach(function(item) {
        this.addMessage(item);
      }.bind(this));
    }.bind(this),
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to retrieve messages', data);
    }
  });
};

App.prototype.send = function(message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: this.server,
    type: 'POST',
    // data: JSON.stringify(message),
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent.');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

var app = new App;
app.init();