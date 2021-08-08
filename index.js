const app = require('./app');
const http = require('http');
const config = require('./utils/config');
const morgan = require('morgan');
const logger = require('./utils/logger');

const server = http.createServer(app);

morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':url :method :response-time ms :body'));

server.listen(config.PORT, () => {
	logger.info(`Server running on port ${config.PORT}`);
});
