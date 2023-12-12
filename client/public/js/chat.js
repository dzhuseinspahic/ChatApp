const input = document.getElementById('message-input');
const chatMessages = document.getElementById('chat-messages');
const activeUsersDiv = document.querySelector('.active-users-list');
const title = document.querySelector('.title-container');

const socket = io();

const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');
const chatId = urlParams.get('chatId');

let currentPage = 1;
const dateOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: 'numeric'
}

chatMessages.addEventListener('scroll', () => {
    if (chatMessages.scrollTop === 0) {
        loadMoreMessages();
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    const h3 = document.createElement('h3');
    h3.textContent = `Welcome ${username} to Chat App!`
    title.appendChild(h3);

    loadMoreMessages();
    //chatMessages.scrollTop = chatMessages.scrollHeight; //scroll to the end of chat
});

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

async function loadMoreMessages() {
    try {
        const response = await fetch(`/api/message/${chatId}?page=${currentPage}`);
        const messages = await response.json(); 

        if (messages && messages.length > 0) {
            await Promise
                .all(messages.map(async (message) => {
                    const userResponse = await fetch(`/api/user/${message.senderId}`);
                    const user = await userResponse.json();
                    message.username = user.username;
                })).then(() => {
                    currentPage += 1;
                    messages.forEach(mess => {
                        const date = new Date(mess.timestamp);
                        const formattedDate = date.toLocaleString('en-US', dateOptions);
                        mess.timestamp = formattedDate;
                        addNewMessage(mess);
                    });
                })
        }
    } catch(error) {
        console.log(error);
    }
}

function addNewMessage(message, newMessage=false) {
    fetch('/partials/partialMessage.mustache') 
        .then((response) => response.text())
        .then((template) => {
            const renderedHTML = Mustache.render(template, { message });
            const div = document.createElement('div');
            div.innerHTML = renderedHTML;
            let firstChild = chatMessages.firstChild;
            if (!newMessage) {
                chatMessages.insertBefore(div, firstChild);
            }
            else {
                chatMessages.appendChild(div);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        }).catch((error) => {
            console.log(error);
        });
}

socket.emit('join-user', {
    username: username,
    chatId: chatId
});

socket.on('message', (data) => {
    if (data !== 'Error') {
        const date = new Date(data.timestamp);
        const formattedDate = date.toLocaleString('en-US', dateOptions);
        data.timestamp = formattedDate;
        addNewMessage(data, true);
        input.value = '';
    }
});

socket.on('join-user', (data) => {
    if (data.senderSocketId !== socket.id) {
        chatMessages.innerHTML += '<p class="message"> <strong>' + data.username + ' </strong>has joined</p>';
    }
});

socket.on('active-users', (data) => {
    activeUsersDiv.innerHTML = '';
    data.forEach(user => {
        if (user !== username) { //onclick for private chat
            activeUsersDiv.innerHTML += `<button type="button" class=" btn btn-outline-light btn-sm">${user}</button>`;
        }
    });
})