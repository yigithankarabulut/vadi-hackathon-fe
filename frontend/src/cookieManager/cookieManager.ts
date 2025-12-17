import { jwtDecode } from "jwt-decode";

interface MyJwtPayload {
    exp?: number;
}


export const setCookie = (name: string, value: string, expireSeconds?: number): void => {
    let expires = "";

    if (name == "access_token") {
        const decoded = jwtDecode<MyJwtPayload>(value);

        if (decoded.exp) {
            const date = new Date(decoded.exp * 1000);
            expires = "; expires=" + date.toUTCString();
        }
    }
    else if (expireSeconds) {
        const date = new Date();
        date.setTime(date.getTime() + (expireSeconds * 1000));
        expires = "; expires=" + date.toUTCString();
    }

    document.cookie =
        name + "=" + (encodeURIComponent(value) || "") +
        expires +
        "; path=/" +
        "; Secure" +
        "; SameSite=Strict";
};

export const getCookie = (name: string): string | null => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
};

export const removeCookie = (name: string): void => {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};