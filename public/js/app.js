document.addEventListener("DOMContentLoaded", function(event) { 
    // Get the first alert on the page
    var alert = document.querySelector(".alert");
    if (alert) {
      setTimeout(function() {
        alert.style.opacity = "0";
        setTimeout(function(){ 
          alert.remove()
          alert.style.display = "none"; 
        }, 600); // This matches the CSS opacity transition time
      }, 5000); // Change 5000 to the number of milliseconds you want
    }


  
  });

var socket = io();

var form = document.getElementById('form');
var input = document.getElementById('input');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', input.value);
    input.value = '';
  }
});

socket.on('chat message', function(msg) {
  var item = document.createElement('li');
  item.textContent = msg['msg'];
  if (msg['role'] == 'OWNER') {
    item.style.color = 'gold';
  } 
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});