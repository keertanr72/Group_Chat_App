// const { token } = require("morgan")

const sentMessageFunction = async () => {
    try {
        const currentTextingPerson = document.getElementById('currentTextingPerson').textContent
        if (!currentTextingPerson) {
            alert('choose whom to text')
            return
        }
        console.log(currentTextingPerson)
        const sentMessageTime = getCurrentTime()
        const sentMessage = appendMessageFunction(sentMessageTime.timeString)
        const token = localStorage.getItem('token')
        console.log(token)
        const data = await axios.post('http://localhost:3000/chat/create', { sentMessage, currentTextingPerson, timeInMs: sentMessageTime.timeInMs, timeString: sentMessageTime.timeString }, { headers: { "Authorization": token } })
        console.log(data)
    } catch (error) {
        console.log(error)
    }
}

const getCurrentTime = () => {
    const now = new Date()
    const timeInMs = now.getTime()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    let timeString = ""
    if (hours >= 12) {
        timeString += (hours == 12 ? 12 : hours - 12) + ":"
        timeString += minutes + " PM"
    } else {
        timeString += (hours == 0 ? 12 : hours) + ":"
        timeString += minutes + " AM"
    }
    return { timeString, timeInMs }
}

const appendMessageFunction = (sentMessageTime) => {
    const newMessage = document.getElementById('sentMessage').value;
    const messageList = document.getElementById('allMessages');
    const newMessageListItem = document.createElement('li');
    newMessageListItem.className = 'message sent'
    const newParagraph = document.createElement('p')
    newParagraph.textContent = newMessage;
    newParagraph.className = 'message-text'
    const divElement = document.createElement('div')
    divElement.className = 'message-info'
    const spanElement = document.createElement('span')
    spanElement.className = 'message-time-right'
    spanElement.textContent = sentMessageTime

    divElement.appendChild(spanElement)
    newMessageListItem.appendChild(newParagraph)
    newMessageListItem.appendChild(divElement)
    messageList.appendChild(newMessageListItem);
    document.getElementById('sentMessage').value = '';
    return newMessage
}

window.addEventListener('load', async () => {
    await updateUserList()
    addListners()
});

const updateUserList = async () => {
    const token = localStorage.getItem('token')
    const userList = document.getElementById('userList')
    const users = await axios.get('http://localhost:3000/user/get-users', { headers: { "Authorization": token } })
    console.log(users.data.users)
    for (let user of users.data.users) {
        const liElement = document.createElement('li')
        liElement.className = 'user'
        liElement.innerHTML +=
            `<div class="user-avatar">
            <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="user-avatar">
        </div>
        <div class="user-info">
            <h4 class="user-name">${user.userName}</h4>
            <p class="user-status">Online</p>
        </div>`
        userList.appendChild(liElement)
    }
}

const addListners = () => {
    const userList = document.getElementById('userList');
    const users = userList.getElementsByClassName('user');
    const currentTextingPerson = document.getElementById('currentTextingPerson')
    const imgUpdate = document.getElementById('imgUpdate')

    for (let i = 0; i < users.length; i++) {
        users[i].addEventListener('click', async () => {
            document.getElementById('allMessages').innerHTML = ''
            imgUpdate.innerHTML = `<img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="user-avatar">`
            currentTextingPerson.textContent = users[i].querySelector('.user-name').textContent
            setInterval(async () => {
                document.getElementById('allMessages').innerHTML = ''
                await loadPreviousChats(currentTextingPerson.textContent)
            }, 1000)
        });
    }
}

const loadPreviousChats = async (userName) => {
    try {
        console.log(userName)
        const token = localStorage.getItem('token')
        const chats = await axios.get(`http://localhost:3000/chat/load-previous-chats/?receiverName=${userName}`, { headers: { "Authorization": token } })
        const currentUserId = chats.data.userId
        for(let chat of chats.data.chats) {
            console.log(chat, chat.userId)
            loadMessagesFunction(chat, currentUserId)
        }

    } catch (error) {
        console.log(error)
    }
}

const loadMessagesFunction = (chat, currentUserId) => {
    const newMessage = chat.message
    const messageList = document.getElementById('allMessages');
    const newMessageListItem = document.createElement('li');
    const newParagraph = document.createElement('p')
    newParagraph.textContent = newMessage;
    newParagraph.className = 'message-text'
    const divElement = document.createElement('div')
    divElement.className = 'message-info'
    const spanElement = document.createElement('span')
    spanElement.textContent = chat.timeString

    divElement.appendChild(spanElement)
    newMessageListItem.appendChild(newParagraph)
    newMessageListItem.appendChild(divElement)
    messageList.appendChild(newMessageListItem);
    if(currentUserId === chat.userId) {
        newMessageListItem.className = 'message sent'
        spanElement.className = 'message-time-right'
    } else {
        newMessageListItem.className = 'message received'
        spanElement.className = 'message-time'
    }
}
