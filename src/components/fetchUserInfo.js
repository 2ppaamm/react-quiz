export const fetchUserInfo = async (accessToken) => {
    const baseURL = `${process.env.REACT_APP_BACKEND_URL}`;
    const endpoint = '/loginInfo';

    try {
        console.log('AccessToken:', accessToken);
        const response = await fetch(`${baseURL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({})
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched User Info:', data);
        return data; // Ensure this includes { isRegistered, user }
    } catch (error) {
        console.error('Error fetching user info:', error);
        throw error;
    }
};
