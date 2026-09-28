import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const app = require('../server/server.js');

export default function handler(req, res) {
    return app(req, res);
}
