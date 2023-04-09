const changePassword = async (event) => {
    event.preventDefault()

    const email = event.target.email.value
    const newPassword = event.target.password.value

    if (!validatePassword(newPassword)) {
        alert('Password should be at least 6 characters long');
        return;
    }

    try {
        const update = await axios.patch('http://localhost:3000/password/update-password', {email, password: newPassword})
    if(update.status === 200){
        window.location.href = "/public/login.html"
    }
    } catch (error) {
        console.log(error)
        if(!error.response.data.success) {
            alert('User Doesnt Exist')
        }
    }
}

function validatePassword(password) {
    // Validate password length
    return password.length >= 6;
}