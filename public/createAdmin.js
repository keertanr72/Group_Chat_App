window.addEventListener('load', async () => {
    const token = localStorage.getItem('token')
    const users = await axios.get(`http://localhost:3000/group/get-group-non-admins/?groupId=${localStorage.getItem('currentTextingPerson')}`, { headers: { "Authorization": token } })
    const divElement = document.getElementById('usersCheckbox')
    for (let user of users.data.users) {
        divElement.innerHTML +=
        `
            <input type="checkbox" name="member" value="${user.user.userName}">
            <label for="${user.user.userName}">${user.user.userName}</label><br>
        `
    }
});

document.getElementById('adminButton').addEventListener('click', async (event) => {
    try {
        event.preventDefault()

        const checkboxes = document.getElementById('usersCheckbox').querySelectorAll('input[type="checkbox"]:checked');
        const selectedUserNames = [];

        for (let i = 0; i < checkboxes.length; i++) {
            selectedUserNames.push(checkboxes[i].value);
        }
        console.log(selectedUserNames)
        const token = localStorage.getItem('token')
        await axios.put(`http://localhost:3000/group/make-admin/?groupId=${localStorage.getItem('currentTextingPerson')}`, {selectedUserNames}, { headers: { "Authorization": token } })
        alert(`success`)
        window.location.href = '/public/chatFrontend.html'
    } catch (error) {
        console.log(error)
    }

})