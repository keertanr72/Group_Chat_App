window.addEventListener('load', async () => {
    const token = localStorage.getItem('token')
    const users = await axios.get(`http://localhost:3000/group/get-group-users/?groupId=${localStorage.getItem('currentTextingPerson')}`, { headers: { "Authorization": token } })
    const divElement = document.getElementById('usersCheckbox')
    for (let user of users.data.users) {
        divElement.innerHTML +=
        `
            <input type="checkbox" name="member" value="${user.user.userName}">
            <label for="${user.user.userName}">${user.user.userName}</label><br>
        `
    }
});

document.getElementById('removeButton').addEventListener('click', async (event) => {
    try {
        event.preventDefault()

        const checkboxes = document.getElementById('usersCheckbox').querySelectorAll('input[type="checkbox"]:checked');
        const selectedUserNames = [];

        for (let i = 0; i < checkboxes.length; i++) {
            selectedUserNames.push(checkboxes[i].value);
        }
        console.log(selectedUserNames)
        const token = localStorage.getItem('token')
        await axios.delete(`http://localhost:3000/group/delete-members/?groupId=${localStorage.getItem('currentTextingPerson')}&selectedUserNames=${selectedUserNames}`, { headers: { "Authorization": token } })
        alert(`success`)
        window.location.href = '/public/chatFrontend.html'
    } catch (error) {
        console.log(error)
    }

})