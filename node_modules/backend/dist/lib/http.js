export function ok(res, data) {
    return res.json({ ok: true, data });
}
export function badRequest(res, message, details) {
    return res.status(400).json({ ok: false, error: { message, details } });
}
export function unauthorized(res, message = 'Unauthorized') {
    return res.status(401).json({ ok: false, error: { message } });
}
export function notFound(res, message = 'Not found') {
    return res.status(404).json({ ok: false, error: { message } });
}
export function internal(res, message = 'Internal server error', details) {
    return res.status(500).json({ ok: false, error: { message, details } });
}
export function getRequestId(req) {
    return req.header('x-request-id') ?? undefined;
}
//# sourceMappingURL=http.js.map