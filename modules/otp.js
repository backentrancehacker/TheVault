function generate(){
    let digits = '0123456789',
		len = 6,
		otp = ''
    for(let i = 0; i < len; i++){
        let index = Math.floor(Math.random()*(digits.length))
        otp += digits[index]
    }
    return otp
}
module.exports.generate = generate