const initailState = {
  loading: false,
  cartItems: [],
};

export const rootReducer = (state = initailState, action) => {
  switch (action.type) {
    case "showLoading":
      return {
        ...state,
        loading: true,
      };
    case "hideLoading":
      return {
        ...state,
        loading: false,
      };
    case "addToCart":
      return {
        ...state,
        cartItems: [...state.cartItems, action.payload],
      };
    case "deleteFromCart":
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (item) => item._id !== action.payload._id
        ),
      };
    case "updateCart":
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item._id == action.payload._id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    default:
      return state;
  }
};
