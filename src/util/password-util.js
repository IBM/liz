/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

const hexEncodePassword = (password) => {
    if (password && typeof password === "string" && password.length > 0) {
        return (
            "%" +
            password
                .split("")
                .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
                .join("%")
        );
    }
    return "";
};

const toAsteriskRepresentation = (password) => {
    return password.replace(/./g, "*");
};

export { hexEncodePassword, toAsteriskRepresentation };
