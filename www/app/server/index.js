var path = require('path'),
	logger = require('morgan'),
	express = require('express'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	livereload = require('connect-livereload'),
	app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(livereload());
app.use(express.static(path.join(__dirname, '..', '..', 'build')));

app.get('/', require('./routes/index'));

app.listen(4000);
