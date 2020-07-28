const sidebarDefaultState = { show: true };

export default (state = sidebarDefaultState, { type, show }) => {
  switch (type) {
    case "SHOW_SIDEBAR":
      return {
        ...state,
        show,
      };
    default:
      return state;
  }
};
