import storage from './storage';

const baseURL = `${process.env.REACT_APP_BACKEND_URL}`;

export const fetchUserInfo = async (idToken) => {
  console.log(idToken)
  try {
    const response = await fetch(`${baseURL}/loginInfo`,{
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
};
