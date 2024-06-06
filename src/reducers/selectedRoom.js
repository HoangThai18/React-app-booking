export const selectedRoomReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_CURRENT_ROOM':
      return {
        ...state,
        selecRoom: action.payload,
      };
    default:
      return state;
  }
};

export default selectedRoomReducer;
