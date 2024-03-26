document.addEventListener("DOMContentLoaded", function (event) {
  // Get the first alert on the page
  var alert = document.querySelector(".alert");
  if (alert) {
    setTimeout(function () {
      alert.style.opacity = "0";
      setTimeout(function () {
        alert.remove()
        alert.style.display = "none";
      }, 600); // This matches the CSS opacity transition time
    }, 5000); // Change 5000 to the number of milliseconds you want
  }



});

var socket = io();

var form = document.getElementById('form');
var input = document.getElementById('input');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', input.value);
    input.value = '';
  }
});

socket.on('chat message', function (msg) {
  var item = document.createElement('li');

  var userSpan = document.createElement('span');
  userSpan.textContent = msg['user'];
  if (msg['role'] == 'OWNER') {
    userSpan.style.color = 'gold';
  }

  item.appendChild(userSpan);
  item.appendChild(document.createTextNode(' : ' + msg['msg']));
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});



document.querySelectorAll('.like-button').forEach(button => {
  button.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent the form from submitting in the traditional manner

    const form = this.closest('form');
    const action = form.getAttribute('action');
    const postID = action.split('/')[2];

    fetch(`/like/${postID}`, { method: 'POST', credentials: 'include' })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok.');

        }
        return response.json();
      })
      .then(data => {
        if (data.redirectTo) {
          window.location.href = data.redirectTo; 
          return;
        }
        if (data.likes !== undefined) {
          console.log("Hello")
          const likesSpan = form.querySelector('span');
          const button = form.querySelector('button');
          button.style.backgroundColor = '#C7C7C7';
          button.className = 'liked-button'
          function onHover() {
            this.style.backgroundColor = '#b30000'; // Set to your desired hover color
        }
        
        // Function to remove hover style
        function offHover() {
            this.style.backgroundColor = '#C7C7C7'; // Reset to original or another color
        }
        
        // Add event listeners
        button.addEventListener('mouseenter', onHover);
        button.addEventListener('mouseleave', offHover);
          likesSpan.textContent = `${data.likes} Likes`; 
        }
      })
      .catch(error => console.error('Error:', error));
  });
});