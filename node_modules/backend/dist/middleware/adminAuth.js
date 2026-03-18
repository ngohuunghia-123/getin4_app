import jwt from 'jsonwebtoken';
import { env } from '../lib/env.js';
import { unauthorized } from '../lib/http.js';
export function requireAdmin(req, res, next) {
    const header = req.header('authorization');
    if (!header)
        return unauthorized(res);
    const [kind, token] = header.split(' ');
    if (kind !== 'Bearer' || !token)
        return unauthorized(res);
    try {
        jwt.verify(token, env.jwtSecret);
        next();
    }
    catch {
        return unauthorized(res);
    }
}
//# sourceMappingURL=adminAuth.js.map