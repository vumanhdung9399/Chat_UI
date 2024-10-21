import { jwtDecode } from "jwt-decode";

export const isTokenExpired = () => {
  try {
    const decoded = jwtDecode(
      JSON.stringify(localStorage.getItem("accessToken"))
    );
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded?.exp && decoded.exp < currentTime;
  } catch (e) {
    return true;
  }
};
