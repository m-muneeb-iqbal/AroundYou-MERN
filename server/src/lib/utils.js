import jwt from "jsonwebtoken";

const isDev = process.env.NODE_ENV === "development";

const cookieOptions = {
    httpOnly: true,
    sameSite: isDev ? "lax" : "none",
    secure: !isDev,
    path: "/",
};

export { cookieOptions };

export const generateToken = (userId, res) => {

    const token = jwt.sign (
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.cookie ("jwt", token, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return token;

};