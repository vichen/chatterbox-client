// YOUR CODE HERE:

var App = function() {
  
};

App.prototype.clearMessages = function() {
  $('#chats').html('');
};
App.prototype.server = 'https://api.parse.com/1/classes/messages';

App.prototype.addRoom = function(roomNameArguments) {
  var roomsToAdd = Array.prototype.slice.call(arguments);
  var options = '';
  
  roomsToAdd.forEach(function(name) {
    options += '<option value="' + name + '">' + name + '</option>';
  });

  $('#selectRoom').append(options);
};

App.prototype.cleanMessage = function(message) {
  //clean name, message, and roomname
  for (var prop in message) {
    if (message.hasOwnProperty(prop)) {
      message[prop] = filterXSS(message[prop]);
    }
  }
  return message;
};

App.prototype.addMessage = function(message) {
  if (message.text === undefined) { return; }

  var message = this.cleanMessage(message);

  var $chatItem = $('<div></div>');
  $chatItem.addClass('chat');
  $chatItem.addClass(message.roomname);
    
  var $username = $('<span></span>');
  $username.addClass('username'); $username.text(message.username);
  $chatItem.append($username);

  //add click function to username... call addFriend
  $username.click( this.addFriend.bind(this, $username.text()) );

  var $message = $('<div></div>'); $message.text(message.text);
  if (this.friendlist.indexOf(message.username) !== -1) {
    $message.addClass('myfriend');
  }
  $chatItem.append($message);
  
  $('#chats').append($chatItem);
  
};

App.prototype.init = function() {
  this.roomlist = [];
  this.friendlist = [];
  this.addRoom('all');
  $('#selectRoom').val('all');
  this.fetch('all');
};

App.prototype.autoUpdate = function() {
  var currentRoom = $('#selectRoom').val();
  this.fetch(currentRoom);
};

App.prototype.fetch = function(room) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: this.server,
    type: 'GET',
    // data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Messages retrieved.');
      //clear messages and roomlist
      this.clearMessages();

      var roomsToAdd = [];
      //update our list of available chatrooms
      data.results.forEach(function(item) {
        if (this.roomlist.indexOf(item.roomname) === -1 && item.roomname !== undefined) {
          this.roomlist.push(item.roomname);
          //add to roomlist selection <option> field
          roomsToAdd.push(item.roomname);
          // this.addRoom(item.roomname);
        }
        //display each message if it matches the selected roomname
        if (room === 'all' || item.roomname === room) {
          this.addMessage(item);
        } 
      }.bind(this));
      this.addRoom.apply(this, roomsToAdd);
      $('#selectRoom').val(room);

    }.bind(app),
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
  if (this.friendlist.indexOf(name) === -1) {
    $('#friendList').append('<div class="friend">' + name + '</div>');
    this.friendlist.push(name);
  }

};

App.prototype.handleSubmit = function(message) {
    //get the message from .userMessage
  var $userMessage = $('.userMessage').val();
  //get the currently selected roomname (default to 'all')
  var $room = $('#selectRoom').val();
  if ($room === 'all') { $room = undefined; }
  $room = $('#newRoomName').val();
  //get username from URL
  var grabUser = function(URLtext) {
    var name = URLtext.match(/&|\?username=(.*)/)[1];
    return name;
  };
  var thisURL = window.location.search;
  var user = grabUser(thisURL);

  App.prototype.send({username: user, text: $userMessage, roomname: $room });
  App.prototype.fetch($room);
  $('.userMessage').val('');
  $('#newRoomName').val('');
};


var app = new App;
$(document).ready(
  function() {
    app.init();
    setInterval(app.autoUpdate.bind(app), 3000);
  });