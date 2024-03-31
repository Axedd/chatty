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

var form = document.getElementById('form');
if (form) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var input = document.getElementById('input'); // Ensure input is defined here if its existence is variable
        if (input && input.value) { // Also checks if input exists and has a value
            socket.emit('chat message', input.value);
            input.value = '';
        }
    });
}

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

function debounce(func, delay) {
  let debounceTimer;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  }
}

function checkLoggedIn() {
  return document.cookie.split(';').some((item) => item.trim().startsWith('loggedIn='));
}

function immediateUIUpdate(button, incrementLikes) {
  const checkLogin = checkLoggedIn();
  if(checkLogin) {
    const form = button.closest('form');
    const likesSpan = form.querySelector('span');
    let likes = parseInt(likesSpan.textContent.split(' ')[0]);
    likes = incrementLikes ? likes + 1 : likes - 1; // Adjust likes count based on action

    // Toggle button styles for liked/unliked state
    if (button.classList.contains('like-button')) {
      button.classList.replace('like-button', 'liked-button');
      button.style.backgroundColor = '#C7C7C7'; // Liked state color
      button.addEventListener('mouseenter', onHover('#b30000'));
      button.addEventListener('mouseleave', offHover('#C7C7C7'));
    } else {
      button.classList.replace('liked-button', 'like-button');
      button.style.backgroundColor = '#007BFF'; // Unliked state color
      button.addEventListener('mouseenter', onHover('#0056B3'));
      button.addEventListener('mouseleave', offHover('#007BFF'));
  }
    // Update likes count in the UI
    likesSpan.textContent = `${likes} Likes`;
  } else {
    window.location.href = 'http://localhost:3000/login'
  }
  
}

const debouncedUpdateLikeState = debounce((postID, isLiked) => {
  console.log(`Updating like state for post ${postID} to ${isLiked} in the database.`);
  fetch(`/like/${postID}`, { method: 'POST', credentials: 'include' })
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok.');
      return response.json();
    })
    .catch(error => console.error('Error:', error));
}, 500); // Adjust the delay as needed




document.querySelectorAll('.like-button, .liked-button').forEach(button => {
  button.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent form submission

    const isLiked = button.classList.contains('like-button');
    const form = button.closest('form');
    const action = form.getAttribute('action');
    const postID = action.split('/')[2];

    // Immediate UI update
    immediateUIUpdate(button, isLiked);

    // Call the debounced function to update the database after a delay
    debouncedUpdateLikeState(postID, isLiked);
  });
});

function onHover(hexCode) {
  return function(event) {
    event.target.style.backgroundColor = hexCode;
  };
}

function offHover(hexCode) {
  return function(event) {
    event.target.style.backgroundColor = hexCode;
  };
}