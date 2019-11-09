import React from 'react';

export default React.createContext({
    token: null,
    userId: null,
    login: (token, userid, tokenExpiration) => {},
    logout: () => {},
});
