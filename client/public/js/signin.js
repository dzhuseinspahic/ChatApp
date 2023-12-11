async function register() {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    
    const feedback = document.querySelector('.emailDiv p');
    if (feedback) feedback.remove();


    if (name.value === '') name.classList.add('is-invalid');
    else name.classList.remove('is-invalid');

    if (email.value === '') email.classList.add('is-invalid');
    else email.classList.remove('is-invalid');
    
    if (password.value === '') password.classList.add('is-invalid');
    else password.classList.remove('is-invalid');

    if (name.value === '' || !email.value === '' || !password.value === '') return;

    const response = await fetch('api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: name.value, 
            email: email.value, 
            password: password.value
        })
    });

    const data = await response.json(); //user

    if (!response.ok) {
        if (data.includes('email')) {
            const emailDiv = document.querySelector('.emailDiv');
            const p = document.createElement('p');
            p.textContent = data;
            emailDiv.appendChild(p);
        }
    } else {
        const globalChat = await fetch(`/api/chat/${data._id}/globalId`);
        const globalChatId = await globalChat.json();

        //add user to global chat
        console.log(data._id, globalChatId.id);
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

