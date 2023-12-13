const passwordRegister = document.getElementById('password');
const emailRegister = document.getElementById('email');
const nameRegister = document.getElementById('name');
const emailDiv = document.querySelector('.email-div');
const usernameLogin = document.getElementById('username-login');
const passwordLogin = document.getElementById('password-login');

async function register() {
    const feedback = document.querySelector('.email-div p');
    if (feedback) feedback.remove();

    if (nameRegister.value === '') nameRegister.classList.add('is-invalid');
    else nameRegister.classList.remove('is-invalid');

    if (emailRegister.value === '') emailRegister.classList.add('is-invalid');
    else emailRegister.classList.remove('is-invalid');
    
    if (passwordRegister.value === '') passwordRegister.classList.add('is-invalid');
    else passwordRegister.classList.remove('is-invalid');

    if (nameRegister.value === '' || emailRegister.value === '' || passwordRegister.value === '') return;

    const response = await fetch('api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: nameRegister.value, 
            email: emailRegister.value, 
            password: passwordRegister.value
        })
    });

    const data = await response.json(); //user

    if (!response.ok) {
        if (data.includes('email')) {
            const p = document.createElement('p');
            p.textContent = data;
            emailDiv.appendChild(p);
        }
    } else {
        const globalChat = await fetch(`/api/chat/${data._id}/globalId`);
        const globalChatId = await globalChat.json();

        //add user to global chat
        await fetch('/api/chat/addUser', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: data._id,
                chatId: globalChatId._id
            })
        }).then(() => {
            window.location.href = `/chat?username=${data.username}&chatId=${globalChatId._id}`;
        });
    }
}

async function login() {
    if (usernameLogin.value === '') usernameLogin.classList.add('is-invalid');
    else usernameLogin.classList.remove('is-invalid');

    if (passwordLogin.value === '') passwordLogin.classList.add('is-invalid');
    else passwordLogin.classList.remove('is-invalid');

    if (usernameLogin.value === '' || usernameLogin.value === '') return;

    const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: usernameLogin.value,
            password: passwordLogin.value
        })
    });

    const data = await response.json(); //user

    if (!response.ok) {
        if (data.includes('Invalid password.')) passwordLogin.classList.add('is-invalid');
        else {
            usernameLogin.classList.add('is-invalid');
            passwordLogin.classList.add('is-invalid');
        }
    } else {
        const globalChat = await fetch(`/api/chat/${data._id}/globalId`);
        const globalChatId = await globalChat.json();

        window.location.href = `/chat?username=${data.username}&chatId=${globalChatId._id}`;
    }
}

function logout() {
    fetch('/api/user/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });
    window.location.href = '/';
}