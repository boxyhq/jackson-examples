import type { NextApiRequest } from 'next';

// Helper function to parse the query string
const parseQuery = (query: NextApiRequest['query']) => {
  const filter = (query.filter as string) || undefined;
  const count = parseInt(query.count as string) || undefined;
  const startIndex = parseInt(query.startIndex as string) || undefined;

  return {
    count,
    startIndex,
    filter,
  };
};

// Fetch the auth token from the request headers
const extractAuthToken = (req: NextApiRequest): string | null => {
  const authHeader = req.headers.authorization || null;

  return authHeader ? authHeader.split(' ')[1] : null;
};

export { parseQuery, extractAuthToken };
