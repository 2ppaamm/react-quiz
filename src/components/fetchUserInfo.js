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
    const user = JSON.stringify(responseData.user);
    localStorage.setItem('userInfo', user);


    console.log("Response---",responseData)
    if (responseData.code === 203) {
      // When code=203, we understand there's no user info because the user is not registered.
      console.log("Status code ", 203)
      return { isRegistered: false, userInfo: null };
    }
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    // Assuming the user info is available and the user is registered
    // const user = JSON.stringify(responseData.user);
    console.log("User",user)
    // localStorage.setItem('userInfo', JSON.stringify(user));
    // If tracks and completedSkills are direct properties of userInfo
    // and need to be accessed independently, store them separately
    if (user.tracks) {
      await storage.setItem('tracks', JSON.stringify(user.tracks));
    }
    if (user.completedSkills) {
      await storage.setItem('completedSkills', JSON.stringify(user.completedSkills));
    }
    if (user?.skills) {
      await storage.setItem('skills', JSON.stringify(user.skills));
    }
    return { isRegistered: true, user };

  } catch (error) {
    console.error('Error fetching user info:', error);
    // Depending on your error handling strategy, you may choose to return a default error state
    // or re-throw the error for the calling code to handle.
    throw error;
  }
};



