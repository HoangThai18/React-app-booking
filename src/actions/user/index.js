export const init = () => {
  return {
    type: 'INIT',
  };
};

export const addNew = (user) => {
  return {
    type: 'ADD',
    payload: user,
  };
};
export const update = (user) => {
  return {
    type: 'UPDATE',
    payload: user,
  };
};
export const updateInfo = (user) => {
  return {
    type: 'UPDATE_INFO',
    payload: user,
  };
};
export const setCurrentUser = (user) => ({
  type: 'SET_CURRENT_USER',
  payload: user,
});
