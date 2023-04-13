window.addEventListener('load', async () => {
    const token = localStorage.getItem('token')
    const users = await axios.get(`http://localhost:3000/user/get-new-users/?groupId=${localStorage.getItem('currentTextingPerson')}`, { headers: { "Authorization": token } })
    console.log(users.data.users)
    const divElement = document.getElementById('usersCheckbox')
    const inviteUsersCheckbox = document.getElementById('inviteUsersCheckbox')
    for (let user of users.data.users) {
        divElement.innerHTML +=
        `
            <input type="checkbox" name="member" value="${user.userName}">
            <label for="${user.userName}">${user.userName}</label><br>
        `

        inviteUsersCheckbox.innerHTML +=
        `
            <input type="checkbox" name="member" value="${user.userName}">
            <label for="${user.userName}">${user.userName}</label><br>
        `
    }
});

document.getElementById('addButton').addEventListener('click', async (event) => {
    try {
        event.preventDefault()

        const checkboxes = document.getElementById('usersCheckbox').querySelectorAll('input[type="checkbox"]:checked');
        const selectedUserNames = [];

        for (let i = 0; i < checkboxes.length; i++) {
            selectedUserNames.push(checkboxes[i].value);
        }
        console.log(selectedUserNames)
        const token = localStorage.getItem('token')
        await axios.put(`http://localhost:3000/group/add-members/?groupId=${localStorage.getItem('currentTextingPerson')}`,{selectedUserNames}, { headers: { "Authorization": token } })
        alert(`success`)
        window.location.href = '/public/chatFrontend.html'
    } catch (error) {
        console.log(error)
    }

})

document.getElementById('inviteButton').addEventListener('click', async (event) => {
    try {
        event.preventDefault()

        const checkboxes = document.getElementById('inviteUsersCheckbox').querySelectorAll('input[type="checkbox"]:checked');
        const selectedUserNames = [];

        for (let i = 0; i < checkboxes.length; i++) {
            selectedUserNames.push(checkboxes[i].value);
        }
        console.log(selectedUserNames)
        const token = localStorage.getItem('token')

        const inviteLink = `http://localhost:3000/group/invite-link-click/?groupId=${localStorage.getItem('currentTextingPerson')}`

        const sentMessageTime = getCurrentTime()

        await axios.post(`http://localhost:3000/chat/create-link-chat`, {selectedUserNames, sentMessage: inviteLink, timeInMs: sentMessageTime.timeInMs, timeString: sentMessageTime.timeString }, { headers: { "Authorization": token } })

        alert(`success`)
        window.location.href = '/public/chatFrontend.html'
    } catch (error) {
        console.log(error)
    }
})

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
