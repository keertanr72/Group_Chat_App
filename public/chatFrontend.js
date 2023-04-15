const socket = io('http://localhost:3000')

let userTokenNumber = 1
let groupTokenNumber = 1
const listOfUserTokens = []
const listOfGroupTokens = []

let groupLiveListener = null
let userLiveListener = null

socket.on('chatMessage', ({ chat, message }) => {
    console.log(`Received a message from ${chat}: ${message}`);
    loadMessagesFunction(chat.chat, chat.userId)
});

socket.on('groupChatMessage', ({ chat, message }) => {
    console.log(chat.chat, parseInt(localStorage.getItem('currentTextingPerson')), chat.userName.userName, message)
    loadGroupMessagesFunction(chat.chat, parseInt(localStorage.getItem('currentTextingPerson')), chat.userName.userName)
});

const sentMessageFunction = async () => {
    try {
        const currentTextingPerson = document.getElementById('currentTextingPerson').textContent
        if (!currentTextingPerson) {
            alert('choose whom to text')
            return
        }
        const sentMessageTime = getCurrentTime()
        let sentMessage = appendMessageFunction(sentMessageTime.timeString)

        const token = localStorage.getItem('token')

        const groupOrPerson = document.getElementById('groupOrPerson')

        if (groupOrPerson.textContent === 'Group') {
            const data = await axios.post(`http://localhost:3000/chat/create-group-chat/?groupId=${localStorage.getItem('currentTextingPerson')}`, { sentMessage, timeInMs: sentMessageTime.timeInMs, timeString: sentMessageTime.timeString }, { headers: { "Authorization": token } })
            socket.emit('groupChatMessage', { groupId: parseInt(localStorage.getItem('currentTextingPerson')), message: sentMessage, chat: data.data} )

        } else {
            const data = await axios.post(`http://localhost:3000/chat/create/?receiverId=${localStorage.getItem('currentTextingPerson')}`, { sentMessage, timeInMs: sentMessageTime.timeInMs, timeString: sentMessageTime.timeString }, { headers: { "Authorization": token } })
            console.log(data.data.userId, parseInt(localStorage.getItem('currentTextingPerson')))

            socket.emit('chatMessage', { from: data.data.userId, to: parseInt(localStorage.getItem('currentTextingPerson')), message: sentMessage, chat: data.data} )
        }
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
    await updateGroupList()
    await updateUserList()
    addListners()
    addGroupListners()
});

const updateUserList = async () => {
    const token = localStorage.getItem('token')
    const userList = document.getElementById('userList')
    const users = await axios.get('http://localhost:3000/user/get-users', { headers: { "Authorization": token } })
    for (let user of users.data.users) {
        const liElement = document.createElement('li')
        liElement.className = 'user'
        liElement.innerHTML +=
            `<div class="user-avatar">
            <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="user-avatar">
        </div>
        <div class="user-info">
            <h4 class="user-name" id=user_token_no_${userTokenNumber}>${user.userName}</h4>
            <p class="user-status"></p>
        </div>`
        userList.appendChild(liElement)
        listOfUserTokens.push(`user_token_no_${userTokenNumber}`)
        localStorage.setItem(`user_token_no_${userTokenNumber}`, user.id)
        userTokenNumber++
    }
}

const updateGroupList = async () => {
    try {
        const token = localStorage.getItem('token')
        const groupList = document.getElementById('groupList')
        const groups = await axios.get('http://localhost:3000/group/get-groups', { headers: { "Authorization": token } })
        console.log(groups.data.groups)
        for (let group of groups.data.groups) {
            const liElement = document.createElement('li')
            liElement.className = 'group'
            liElement.innerHTML +=
                `<div class="user-avatar">
                <img src="https://thumbs.dreamstime.com/b/teamwork-group-friends-logo-image-holding-each-other-39918563.jpg" alt="group-avatar">
            </div>
            <div class="group-info">
                <h4 class="group-name" id=group_token_no_${groupTokenNumber}>${group.groupName}</h4>
                <p class="group-status" id="typeGroup">Group</p>
            </div>`
            groupList.appendChild(liElement)
            listOfGroupTokens.push(`group_token_no_${groupTokenNumber}`)
            localStorage.setItem(`group_token_no_${groupTokenNumber}`, group.id)
            groupTokenNumber++
        }
    } catch (error) {
        console.log(error)
    }

}

const addGroupListners = () => {
    const groupList = document.getElementById('groupList');
    const groups = groupList.getElementsByClassName('group');
    const currentTextingPerson = document.getElementById('currentTextingPerson')
    const imgUpdate = document.getElementById('imgUpdate')

    for (let i = 0; i < listOfGroupTokens.length; i++) {
        try {
            document.getElementById(listOfGroupTokens[i]).addEventListener('click', async () => {
                document.getElementById('addNewMemberButtonHere').innerHTML = ''
                document.getElementById('addMakeAdminButtonHere').innerHTML = ''
                document.getElementById('addRemoveMemberButtonHere').innerHTML = ''
                if (groupLiveListener) {
                    clearInterval(groupLiveListener);
                }
                if (userLiveListener) {
                    clearInterval(userLiveListener);
                }
                localStorage.setItem('currentTextingPerson', localStorage.getItem(listOfGroupTokens[i]))
                document.getElementById('groupOrPerson').textContent = 'Group'
                document.getElementById('allMessages').innerHTML = ''
                imgUpdate.innerHTML = `<img src="https://thumbs.dreamstime.com/b/teamwork-group-friends-logo-image-holding-each-other-39918563.jpg" alt="group-avatar">`
                const token = localStorage.getItem('token')
                const adminStatus = await axios.get(`http://localhost:3000/user/check-admin-status/?currentTextingPerson=${localStorage.getItem('currentTextingPerson')}`, { headers: { "Authorization": token } })

                console.log(adminStatus.data.userData.isAdmin)

                if (adminStatus.data.userData.isAdmin) {
                    document.getElementById('addNewMemberButtonHere').innerHTML = '<button id="addMembersButton" onclick="addMembersButtonFunction()">Add Members</button>'

                    document.getElementById('addMakeAdminButtonHere').innerHTML = '<button id="makeAdminButton" onclick="createAdminFunction()">Create New Admins</button>'

                    document.getElementById('addRemoveMemberButtonHere').innerHTML = '<button id="removeMembersButton" onclick="removeMembersFunction()">Remove Members</button>'
                }
                currentTextingPerson.textContent = groups[i].querySelector('.group-name').textContent
                await loadPreviousGroupChats(localStorage.getItem(listOfGroupTokens[i]))

                socket.emit('joinGroupChat', { groupId: parseInt(localStorage.getItem('currentTextingPerson')) })

                // groupLiveListener = setInterval(async () => {
                //     const token = localStorage.getItem('token')
                //     const recentReceivedChat = JSON.parse(localStorage.getItem('recentReceivedChat'))
                //     if (!recentReceivedChat) {
                //         localStorage.setItem('recentReceivedChat', JSON.stringify({}))
                //     }
                //     const chats = await axios.get(`http://localhost:3000/group/load-live-group-messages/?groupId=${localStorage.getItem(listOfGroupTokens[i])}&timeInMs=${recentReceivedChat.timeInMs}`, { headers: { "Authorization": token } })
                //     if (chats.data.chats.length !== 0) {
                //         console.log(chats.data.chats[0].userId)
                //         localStorage.setItem('recentReceivedChat', JSON.stringify(chats.data.chats[0]))
                //         if (chats.data.chats[0].userId !== chats.data.userId)
                //             loadGroupMessagesFunction(chats.data.chats[0], chats.data.userId, chats.data.chats[0].user.userName)
                //     }
                // }, 1000)



            });
        } catch (error) {
            console.log(error)
        }
    }
}

const addListners = () => {
    const userList = document.getElementById('userList');
    const users = userList.getElementsByClassName('user');
    const currentTextingPerson = document.getElementById('currentTextingPerson')
    const imgUpdate = document.getElementById('imgUpdate')

    for (let i = 0; i < listOfUserTokens.length; i++) {
        try {
            document.getElementById(listOfUserTokens[i]).addEventListener('click', async () => {

                document.getElementById('addNewMemberButtonHere').innerHTML = ''
                document.getElementById('addMakeAdminButtonHere').innerHTML = ''
                document.getElementById('addRemoveMemberButtonHere').innerHTML = ''
                if (groupLiveListener) {
                    clearInterval(groupLiveListener);
                }
                if (userLiveListener) {
                    clearInterval(userLiveListener);
                }
                localStorage.setItem('currentTextingPerson', localStorage.getItem(listOfUserTokens[i]))
                document.getElementById('groupOrPerson').textContent = ''
                document.getElementById('allMessages').innerHTML = ''
                imgUpdate.innerHTML = `<img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="user-avatar">`
                currentTextingPerson.textContent = users[i].querySelector('.user-name').textContent
                const currentUserId = await loadPreviousChats(localStorage.getItem(listOfUserTokens[i]))

                console.log(currentUserId, parseInt(localStorage.getItem('currentTextingPerson')))

                socket.emit('joinChat', { from: currentUserId, to: parseInt(localStorage.getItem('currentTextingPerson')) }, () => {
                    console.log('socket emit connection')
                });

                // userLiveListener = setInterval(async () => {
                //     const token = localStorage.getItem('token')
                //     const recentReceivedChat = JSON.parse(localStorage.getItem('recentReceivedChat'))
                //     if (!recentReceivedChat) {
                //         localStorage.setItem('recentReceivedChat', JSON.stringify({}))
                //     }
                //     const chats = await axios.get(`http://localhost:3000/chat/load-live-receiver-messages/?receiverId=${localStorage.getItem(listOfUserTokens[i])}&timeInMs=${recentReceivedChat.timeInMs}`, { headers: { "Authorization": token } })
                //     if (chats.data.chats.length !== 0) {
                //         localStorage.setItem('recentReceivedChat', JSON.stringify(chats.data.chats[0]))
                //         loadMessagesFunction(chats.data.chats[0], chats.data.chats[0].receiverId)
                //     }
                // }, 1000)
            });
        } catch (error) {
            console.log(error)
        }
    }
}

const loadPreviousGroupChats = async (groupId) => {
    try {
        let recentReceivedChat
        const token = localStorage.getItem('token')
        const chats = await axios.get(`http://localhost:3000/group/load-previous-group-chats/?groupId=${groupId}`, { headers: { "Authorization": token } })
        console.log(chats)
        const currentUserId = chats.data.userId
        for (let chat of chats.data.chats) {
            loadGroupMessagesFunction(chat, currentUserId, chat.user.userName)
            if (currentUserId !== chat.userId) {
                recentReceivedChat = chat
            }
        }
        console.log(recentReceivedChat)
        if (recentReceivedChat) {
            localStorage.setItem('recentReceivedChat', JSON.stringify(recentReceivedChat))
        } else {
            localStorage.setItem('recentReceivedChat', 'null')
        }


    } catch (error) {
        console.log(error)
    }
}

const loadPreviousChats = async (userId) => {
    try {
        let recentReceivedChat
        const token = localStorage.getItem('token')
        const chats = await axios.get(`http://localhost:3000/chat/load-previous-chats/?receiverId=${userId}`, { headers: { "Authorization": token } })
        const currentUserId = chats.data.userId
        for (let chat of chats.data.chats) {
            loadMessagesFunction(chat, currentUserId)
            if (currentUserId !== chat.userId) {
                recentReceivedChat = chat
            }
        }
        console.log(recentReceivedChat)
        if (recentReceivedChat) {
            localStorage.setItem('recentReceivedChat', JSON.stringify(recentReceivedChat))
        } else {
            localStorage.setItem('recentReceivedChat', 'null')
        }
        return currentUserId

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
    if (currentUserId !== chat.userId) {
        newMessageListItem.className = 'message sent'
        spanElement.className = 'message-time-right'
    } else {
        newMessageListItem.className = 'message received'
        spanElement.className = 'message-time'
    }
}

const createGroupButtonFunction = () => {
    window.location.href = '/public/createGroup.html'
}

const loadGroupMessagesFunction = (chat, currentUserId, senderUserName) => {

    const allMessages = document.getElementById('allMessages')

    if (currentUserId === chat.userId) {
        allMessages.innerHTML +=
            `<li class="message sent">
            <div class="message-sender-right">
                <span class="message-sender-name"></span>
            </div>
            <p class="message-text">${chat.message}</p>
            <div class="message-info">
                <span class="message-time-right">${chat.timeString}</span>
            </div>
        </li>`
    } else {
        allMessages.innerHTML +=
            `<li class="message received">
            <div class="message-sender-left">
                <span class="message-sender-name">${senderUserName}</span>
            </div>
            <p class="message-text">${chat.message}</p>
            <div class="message-info">
                <span class="message-time">${chat.timeString}</span>
            </div>
        </li>`
    }
}

const addMembersButtonFunction = () => {
    window.location.href = '/public/addMembersToGroup.html'
}

const removeMembersFunction = () => {
    window.location.href = '/public/removeMembersFromGroup.html'
}

const createAdminFunction = () => {
    window.location.href = '/public/createAdmin.html'
}