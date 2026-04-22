const pino = require('pino');
const path = require('path');
const fs = require('fs');
const pinoPretty = require('pino-pretty');

const logsDir = path.join(__dirname, '../../logs');

if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const logLevels = {
    app: 'info',
    error: 'error',
    request: 'info',
    warning: 'warn',
    debug: 'debug'
};

const createLogger = (name, level = 'info') => {
    const fileDestination = pino.destination(path.join(logsDir, `${name}.log`));
    const prettyTransport = pinoPretty({
        translateTime: 'SYS:standard',
        colorize: true,
        ignore: 'pid,hostname'
    });

    return pino({
        level: level,
        formatters: {
            level: (label) => ({ level: label }),
        },
        timestamp: pino.stdTimeFunctions.isoDate,
    }, pino.multistream([
        { stream: prettyTransport },
        { stream: fileDestination }
    ]));
};

const logger = {
    app: createLogger('app', logLevels.app),
    error: createLogger('error', logLevels.error),
    request: createLogger('request', logLevels.request),
    warning: createLogger('warning', logLevels.warning),
    debug: createLogger('debug', logLevels.debug),

    info: (module, message, data = {}) => {
        logger.app.info({ module, ...data }, message);
    },

    error: (module, message, error = null, data = {}) => {
        const errorData = error ? { error: error.message, stack: error.stack, ...data } : data;
        logger.error.error({ module, ...errorData }, message);
    },

    warn: (module, message, data = {}) => {
        logger.warning.warn({ module, ...data }, message);
    },

    debug: (module, message, data = {}) => {
        logger.debug.debug({ module, ...data }, message);
    },

    http: (module, message, data = {}) => {
        logger.request.info({ module, ...data }, message);
    },

    logRequest: (req) => {
        logger.request.info({
            module: 'HTTP',
            method: req.method,
            url: req.originalUrl || req.url,
            ip: req.ip || req.connection?.remoteAddress,
            userAgent: req.get('user-agent')
        }, `HTTP ${req.method} ${req.originalUrl || req.url}`);
    }
};

module.exports = logger;