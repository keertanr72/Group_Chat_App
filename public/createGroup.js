const createGroupFunction = async (event) => {
    try {
        event.preventDefault()

        const groupName = event.target.groupName.value

        const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        const selectedUserNames = [];

        for (let i = 0; i < checkboxes.length; i++) {
            selectedUserNames.push(checkboxes[i].value);
        }
        console.log(groupName, selectedUserNames)
        const token = localStorage.getItem('token')
        await axios.post(`http://localhost:3000/group/create`,{groupName, selectedUserNames}, { headers: { "Authorization": token } })
        alert(`success`)
        window.location.href = '/public/chatFrontend.html'
    } catch (error) {
        console.log(error)
    }

}

window.addEventListener('load', async () => {
    const token = localStorage.getItem('token')
    const users = await axios.get('http://localhost:3000/user/get-users', { headers: { "Authorization": token } })

    console.log(users.data.users)
    const divElement = document.getElementById('usersCheckbox')
    divElement.innerHTML = ''
    for (let user of users.data.users) {
        divElement.innerHTML +=
            `<label>
            <input type="checkbox" value="${user.userName}">
            ${user.userName}
            </label>`
    }
});