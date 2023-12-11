const input = document.getElementById('message-input');
const chatMessages = document.getElementById('chat-messages');
const activeUsersDiv = document.querySelector('.active-users-list');
const title = document.querySelector('.title-container');

const socket = io();

const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');
const chatId = urlParams.get('chatId');

function sendMessage() {
    const message = input.value.trim();

    if (message !== '') {
        socket.emit('message', {
            username: username,
            chatId: chatId, 
            message: message
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const h3 = document.createElement('h3');
    h3.textContent = `Welcome ${username} to Chat App!`
    title.appendChild(h3);
});

socket.emit('join-user', {
    username: username,
    chatId: chatId
});

socket.on('message', (data) => {
    console.log('mes client')
    if (data !== 'Error') {
        chatMessages.innerHTML += 
            '<div class=\'message\'> <div class=\'message-info\'><p class=\'username\'>' + data.username + '</strong>  </p>' +
            '<p class=\'time\'>' + data.time + '</p></div>' +
            '<div class=\'message-text\'>' + data.message + '</div></div>';
        chatMessages.scrollTop = chatMessages.scrollHeight;
        input.value = '';
    }
});

socket.on('join-user', (data) => {
    if (data.senderSocketId !== socket.id) {
        chatMessages.innerHTML += '<p> <strong>' + data.username + ' </strong>has joined</p>';
    }
});

socket.on('active-users', (data) => {
    activeUsersDiv.innerHTML = '';
    data.forEach(user => {
        if (user !== username) { //onclick for private chat
            activeUsersDiv.innerHTML += `<button type="button" class="btn btn-outline-light btn-sm">${user}</button>`;
        }
    });
})