import 'dotenv/config';
function required(name) {
    const v = process.env[name];
    if (!v)
        throw new Error(`Missing env: ${name}`);
    return v;
}
export const env = {
    port: Number(process.env.PORT ?? 4000),
    databaseUrl: required('DATABASE_URL'),
    adminPassword: required('ADMIN_PASSWORD'),
    jwtSecret: required('JWT_SECRET'),
    corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:5173')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
};
//# sourceMappingURL=env.js.map