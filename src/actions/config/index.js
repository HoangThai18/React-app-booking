export const setLoading = (status) => {
  return {
    type: 'SET_LOADING',
    payload: status,
  };
};

export const setLoadingMsg = (status) => {
  return {
    type: 'SET_LOADING_MSG',
    payload: status,
  };
};
