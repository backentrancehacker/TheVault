// General server
const express = require('express'),
	cookieParser = require("cookie-parser"),

	// General modules
	path = require('path'),
	crypto = require('crypto'),
	fs = require('fs'),
	util = require('./modules/util'),
	{generate} = require('./modules/otp'),

	// Dependencies
	multer = require('multer'),
	rateLimit = require("express-rate-limit"),
	cors = require('cors'),

	// Passwords
	secret = process.env.password,
	limiter = rateLimit({
		windowMs: 30 * 60 * 1000, 
		max: 4,
		message: "Too many password attempts. Please wait 30 minutes."
	})
 

const upload = multer({ storage: multer.diskStorage({
		destination: './public/uploads/',
		filename: (req, file, cb) => {
			crypto.pseudoRandomBytes(6, (err, raw) => {
				if (err) return cb(err)

				cb(null, raw.toString('hex') + path.extname(file.originalname))
			})
		}
	})
})

module.exports = app => { 

	// EJS
	app.set('views', path.join(__dirname, 'public'))
	app.engine('html', require('ejs').renderFile)
	app.set('view engine', 'html')
	
	// CORS
	app.use(cors())
	app.set('trust proxy', true)

	// General
	app.use(express.json())
	app.use(express.urlencoded({ extended: true }))
	app.use(express.static(path.join(__dirname , '/public')))
	app.use(cookieParser())

	// Middleware
	app.use((req, res, next) => {
		if (req.headers['x-forwarded-proto'] === 'http') res.redirect(`https://${req.headers.host}${req.url}`)

		else next()
	})

	// Routes
	app.get('/', (req, res) => {
		res.render('index.html')
	})
	app.get('/dash', (req, res) => {
		let password = req.cookies['authorized']
		if(password != secret){
			res.redirect('/')
			return
		}
		let files = fs.readdirSync('./public/uploads')
		res.render('dash.html', {
			files: files
		})
	})

	// File Upload
	app.post('/upload', upload.single('file'), (req, res) => {
		let file = req.file
		let password = req.cookies['authorized']
		if(!file) {
			res.send({
				error: 'No file attached.'
			})
			return
		}
		if(password != secret) return

		res.send({
			success: 'File uploaded.',
			file: `${req.file.filename}`
		})
	})

	app.post('/delete', (req, res) => {

		let password = req.cookies['authorized']
		let target = req.body.target
		if(password != secret) return
		if(!target){
			res.send({
				error: 'Invalid target.'
			})
			return
		}
		try{
			fs.unlink(`./public/uploads/${target}`, err => {
				if(err) console.log('Error')
				else{
					res.send({
						success: 'Deleted file.'
					})
				}
			})
		}
		catch(e){
			res.send({
				error: 'Invalid target.'
			})
		}

	})

	app.post('/login', limiter, (req, res) => {

		let password = req.body.password
		util.log('Login attempt', password)

		if(!password){
			res.send({
				error: 'Invalid password, no payload attached.'
			})
		}
		else if(password == secret){
			res.cookie('authorized', secret, {httpOnly: true, overwrite: true})
			res.send({
				success: '/dash'
			})
		}
		else{
			res.send({
				error: 'Incorrect password, please try again.'
			})
			
		}		
	})
	app.use((req, res) => {	
		res.status(404).render('error.html', {
			error: "Oops you're lost :("
		})
	});
	app.use((err, req, res, next) => {
		res.status(500).render('error.html',  {
			error: "Internal server error :("
		})
	});	
}

function purge(){
	let files = fs.readdirSync('./public/uploads')
	for(let file of files){
		fs.unlink(`./public/uploads/${file}`, err => {
			if(err) console.log('Error')
			else console.log('Removed.')
		})
	}
}