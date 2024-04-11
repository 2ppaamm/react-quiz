import storage from './storage';

const baseURL = `${process.env.REACT_APP_BACKEND_URL}`;

export const fetchUserInfo = async (idToken) => {

  try {
    const response = await fetch(`${baseURL}/loginInfo`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
    });

    const responseData = await response.json();
    if (responseData.code === 203) {
      // When code=203, we understand there's no user info because the user is not registered.
      return { isRegistered: false, userInfo: null };
    }

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    // Assuming the user info is available and the user is registered
    const userInfo = responseData;
    await storage.setItem('userInfo', JSON.stringify(userInfo));

    // If tracks and completedSkills are direct properties of userInfo
    // and need to be accessed independently, store them separately
    if (userInfo.tracks) {
      await storage.setItem('tracks', JSON.stringify(userInfo.tracks));
    }
    if (userInfo.completedSkills) {
      await storage.setItem('completedSkills', JSON.stringify(userInfo.completedSkills));
    }
    if (userInfo.skills) {
      await storage.setItem('skills', JSON.stringify(userInfo.skills));
    }
    return { isRegistered: true, userInfo };

  } catch (error) {
    console.error('Error fetching user info:', error);
    // Depending on your error handling strategy, you may choose to return a default error state
    // or re-throw the error for the calling code to handle.
    throw error;
  }
};



