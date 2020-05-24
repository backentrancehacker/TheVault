// Server
const app = require('express')(),
	util = require('./modules/util.js')


require('./routes.js')(app)
app.listen(8080)
util.log('Initialized')