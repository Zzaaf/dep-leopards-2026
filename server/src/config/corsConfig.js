const allowedOrigins = new Set([
  'http://localhost:3000',
  'http://139.100.194.171',
  'http://139.100.194.171:80',
]);

const corsConfig = {
  origin: (origin, callback) => {
    // Non-browser requests (e.g. server-to-server, curl) often have no Origin.
    if (!origin) return callback(null, true);
    if (allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error(`CORS: origin ${origin} is not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};

module.exports = corsConfig;
