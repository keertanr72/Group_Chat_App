const form = document.querySelector('form');

form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const email = event.target.email.value
    try {
        const status = await axios.post('http://localhost:3000/password/forgot-password', {email})
        if(status.data.message === 'successfull'){
            console.log('hello')
            alert('success')
            window.location.href = "/public/redirectEmail.html"
        }
    } catch (error) {
        console.log(error)
        alert('Enter valid Email')
    }
})