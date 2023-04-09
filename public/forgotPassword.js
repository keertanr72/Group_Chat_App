const form = document.querySelector('form');

form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const email = event.target.email.value
    const status = await axios.post('http://localhost:3000/password/forgot-password', {email})
    console.log(status.data.message)
    if(status.data.message === 'successfull'){
        console.log('hello')
        alert(email)
        window.location.href = "/public/redirectEmail.html"
    }  
})