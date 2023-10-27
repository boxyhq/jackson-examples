const apiUrl = process.env.REACT_APP_API_URL;

export const authenticate = async (token: string | undefined) => {
  if (!token) {
    throw new Error('Access token not found.');
  }

  const response = await fetch(`${apiUrl}/api/authenticate?access_token=${token}`, {
    method: 'GET',
    credentials: 'include',
  });
  if (response.ok) {
    return await response.json();
  }
  return null;
};

export const getProfileByJWT = async () => {
  const response = await fetch(`${apiUrl}/api/profile`, {
    method: 'GET',
    credentials: 'include',
  });

  return await response.json();
};
