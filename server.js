//Install express server
const express = require('express');
const path = require('path');

const app = express();


// Serve only the static files form the dist directory
app.use(express.static('./dist/catalogue-web-app'));

app.get('/*',(req, res) =>{
	//res.sendFile(path.join(__dirname+'/dist/catalogue-web-app/index.html')
	res.sendFile('index.html', { root: 'dist/catalogue-web-app' }
	
	);
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);


console.log(`Running on port ${process.env.PORT || 8080}`)

