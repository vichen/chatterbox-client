// YOUR CODE HERE:

var App = function() {};

App.prototype.clearMessages = function() {
  $('#chats').html('');
};
App.prototype.server = 'https://api.parse.com/1/classes/messages';

App.prototype.addRoom = function(roomName) {
  $('#selectRoom').append('<option value="' + roomName + '">' + roomName + '</option>');
};

App.prototype.addMessage = function(message) {
  var $chatItem = $('<div></div>');
  $chatItem.addClass('chat');
  $chatItem.addClass(message.roomname);
  
  var $username = $('<span></span>');
  $username.addClass('username'); $username.text(message.username);
  $chatItem.append($username);

  //add click function to username... call addFriend
  $username.click( this.addFriend.bind(this, $username.text()) );

  var $message = $('<div></div>'); $message.text(message.text);
  $chatItem.append($message);
  
  $('#chats').append($chatItem);
};

App.prototype.init = function() {
  var selectedRoom = $('#selectRoom').val();
  this.roomlist = [];
  this.fetch(selectedRoom);
};

App.prototype.fetch = function(room) {
  var room = room || 'lobby';
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: this.server,
    type: 'GET',
    // data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Messages retrieved.');
      //clear messages
      this.clearMessages();
      //update our list of available chatrooms
      data.results.forEach(function(item) {
        if (!this.roomlist.indexOf(item.roomname)) {
          this.roomlist.push(item.roomname);
          //add to roomlist selection <option> field
          this.addRoom(item.roomName);
        }
      }.bind(this));

      //display each message
      data.results.forEach(function(item) {
        if (item.roomname === room) {
          this.addMessage(item);
        } 
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

App.prototype.addFriend = function(name) {
  console.log(name);
};

App.prototype.handleSubmit = function(message) {
    //get the message from .userMessage
  var $userMessage = $('.userMessage').val();

  var grabUser = function(URLtext) {
    var name = URLtext.match(/&|\?username=(.*)/)[1];
    return name;
  };

  var thisURL = window.location.search;
  var user = grabUser(thisURL);
  //var message = $('input.userMessage');
  App.prototype.send({username: user, text: $userMessage });
  App.prototype.fetch();
};







var app = new App;
app.init();