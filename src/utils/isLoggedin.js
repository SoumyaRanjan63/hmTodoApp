export const isLoggedin = () => {
    if (localStorage.getItem("token")) {
        console.log(token)
        return true;
    } else {
        return false;
    }
}