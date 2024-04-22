import { authStart, authSuccess, authFailure } from "../userSlice";
import { api } from "../../api";

export const signUp = (userData, navigateTo) => async (dispatch) => {
  try {
    dispatch(authStart());
    console.log(userData);
    const response = await api.post("/register", userData);
    console.log(response.data);
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    dispatch(authSuccess(null));
    navigateTo();
    alert("Account created successfully. Please login to continue.");
  } catch (error) {
    dispatch(authFailure(error.message));
  }
};

export const signIn = (credentials, navigateTo) => async (dispatch) => {
  try {
    dispatch(authStart());

    const user = await api.post("/login", credentials);
    if (user.data.error) {
      throw new Error(user.data.error);
    }
    localStorage.setItem("token", user.data.data.token);
    dispatch(authSuccess(user.data.data.userDb));
    navigateTo();
    alert(" Login successful");
  } catch (error) {
    dispatch(authFailure(error.message));
  }
};
