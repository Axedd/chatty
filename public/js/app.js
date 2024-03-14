document.addEventListener('DOMContentLoaded', () => {
    var socket = io();

    var messages = document.getElementById('messages');
    var form = document.getElementById('form');
    var input = document.getElementById('input');
    
    var inputUsername = document.getElementById('inputUsername');
    var formUsername = document.getElementById('formUsername')

    if (formUsername) {
        formUsername.addEventListener('submit', function(e) {
            console.log("Works2")
            e.preventDefault();
            socket.emit('add username', inputUsername.value);
            inputUsername.value = '';
        })
    }

    if (form) {
        form.addEventListener('submit', function(e) {
            console.log("Works1")
            e.preventDefault();
            if (input.value) {
                socket.emit('chat message', input.value);
                input.value = '';
            }
        });
    }

    socket.on('showAlertUsername', function(msg) {
        alert(msg)
    })

    socket.on('change username', function(username)  {
        console.log(username)
        document.getElementById('usernameDisplay').innerHTML = `Username: ${username}`
    });

    socket.on('chat message', function(msg) {
        var item = document.createElement('li');
        item.textContent = msg;
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    });

    socket.on('display-gif', (data) => {
      const img = document.createElement('img');
      img.src = data.url;
      document.body.appendChild(img);
    });
});