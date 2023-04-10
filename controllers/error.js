exports.sendError = (req, res) => {
    console.log('error//////////////////////////////////////////////////////')
    res.redirect('http://127.0.0.1:5500/public/error.html')
}