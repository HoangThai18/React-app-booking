export const configReducer = (
  state = {
    loading: false,
    loadingMsg: false,
  },
  action
) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_LOADING_MSG':
      return {
        ...state,
        loadingMsg: action.payload,
      };
    default:
      return state;
  }
};

export default configReducer;
