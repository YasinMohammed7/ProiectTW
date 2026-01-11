const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLoginController = asyncHandler(async (req, res) => {
    const { credential } = req.body;

    const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload();

    console.log("Google payload", payload);

    const { sub: googleId, email, name, given_name: givenName, family_name: familyName, picture } = payload;

    let user = await User.findOne({ googleId });

    if (!user) {
        user = await User.create({ googleId, email, name, givenName, familyName, picture });
        console.log('User created', user);
    } else {
        user.lastLogin = Date.now();
        await user.save();
        console.log('User updated', user);
    }

    const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    res.json({
        success: true,
        message: 'User logged in successfully',
        user: {
            email: user.email,
            name: user.name,
            givenName: user.givenName,
            familyName: user.familyName,
            picture: user.picture,
            lastLogin: user.lastLogin
        },
        accessToken: accessToken,
    });
});

const refresh = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' });
    const refreshToken = cookies.jwt;

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Forbidden - Invalid token' });
            }

            // Verifică dacă utilizatorul încă există și e activ
            const user = await User.findById(decoded.userId);

            if (!user || !user.isActive) {
                return res.status(401).json({ message: 'Unauthorized - User not found' });
            }

            // Generează nou access token
            const accessToken = jwt.sign(
                { userId: user._id },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            );

            const refreshToken = jwt.sign(
                { userId: user._id },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '7d' }
            );

            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'None',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            })

            res.json({ success: true, message: 'Token refreshed successfully', user: { email: user.email, name: user.name, givenName: user.givenName, familyName: user.familyName, picture: user.picture, lastLogin: user.lastLogin }, accessToken });
        })
    );
}

const logout = (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.sendStatus(204); // No content - deja delogat
    }

    // Șterge cookie-ul
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'None'
    });

    res.json({ success: true, message: 'Logged out successfully' });
}

module.exports = {
    googleLoginController,
    refresh,
    logout
}