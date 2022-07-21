import type { NextApiRequest } from 'next';

// Fetch the auth token from the request headers
const extractAuthToken = (req: NextApiRequest): string | null => {
  const authHeader = req.headers.authorization || null;

  return authHeader ? authHeader.split(' ')[1] : null;
};

export { extractAuthToken };
