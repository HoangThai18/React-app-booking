export const userReducer = (
  state = {
    userList: [],
    currentUser: undefined,
  },
  action
) => {
  switch (action.type) {
    case 'INIT':
      const initState = {
        ...state,
        userList: [],
      };
      return initState;
    case 'ADD':
      const newArr = {
        ...state,
        userList: [...state.userList, action.payload],
      };
      return newArr;
    case 'UPDATE':
      const index = state.findIndex((user) => user.username === action.payload.username);
      state[index] = action.payload;
      return state;
    case 'UPDATE_INFO':
      if (state.currentUser.username === action.payload.username) {
        return {
          ...state,
          currentUser: {
            ...state.currentUser,
            ...action.payload,
          },
        };
      } else {
        return {
          ...state,
          userList: state.userList.map((user) =>
            user.username === action.payload.username ? { ...user, ...action.payload } : user
          ),
        };
      }
    case 'SET_CURRENT_USER':
      return {
        ...state,
        currentUser: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
