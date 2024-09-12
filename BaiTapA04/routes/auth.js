const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OTP = require('../models/OTP');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const router = express.Router();

// // Khởi tạo transporter cho nodemailer
// const transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//         user: 'khuongchet2003@gmail.com',
//         pass: 'fehw qmov qzpd ikks'
//     }
// });

// Route đăng ký
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email và mật khẩu là bắt buộc.' });
    }

    try {
        const userExists = await User.findOne({ where: { email } });

        if (userExists) {
            return res.status(400).json({ success: false, message: 'Email đã tồn tại.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ email, password: hashedPassword });
        res.json({ success: true, message: 'Đăng ký thành công!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Có lỗi xảy ra.' });
    }
});

// Route đăng nhập
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Email hoặc mật khẩu không đúng.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Email hoặc mật khẩu không đúng.' });
        }

        const token = jwt.sign({ userId: user.id }, 'your-jwt-secret', { expiresIn: '1h' });

        res.json({ success: true, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Có lỗi xảy ra.' });
    }
});

// Route gửi mã OTP
router.post('/send-otp', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Email không tồn tại.' });
        }

        const otpCode = crypto.randomInt(100000, 999999).toString();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // OTP hết hạn sau 15 phút

        await OTP.create({ userId: user.id, otpCode, expiresAt });

        // Cấu hình transporter gửi email
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'khuongchet2003@gmail.com',
                pass: 'fehw qmov qzpd ikks'
            }
        });

        const mailOptions = {
            from: 'khuongchet2003@gmail.com',
            to: email,
            subject: 'Mã OTP của bạn',
            text: `Mã OTP của bạn là: ${otpCode}. Mã này sẽ hết hạn sau 15 phút.`
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: 'OTP đã được gửi.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Có lỗi xảy ra.' });
    }
});





// Route xác nhận mã OTP
router.post('/verify-otp', async (req, res) => {
    const { email, otpCode } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Email không tồn tại.' });
        }

        const otp = await OTP.findOne({
            where: { userId: user.id, otpCode },
            order: [['expiresAt', 'DESC']]
        });

        if (!otp || otp.expiresAt < new Date()) {
            return res.status(400).json({ success: false, message: 'Mã OTP không hợp lệ hoặc đã hết hạn.' });
        }

        // Xóa OTP đã sử dụng
        await OTP.destroy({ where: { id: otp.id } });

        res.json({ success: true, message: 'Mã OTP xác nhận thành công.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Có lỗi xảy ra.' });
    }
});




// Route đặt lại mật khẩu

router.post('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;

    if (!newPassword) {
        return res.status(400).json({ success: false, message: 'Mật khẩu mới là bắt buộc.' });
    }

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Email không tồn tại.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.update({ password: hashedPassword }, { where: { id: user.id } });

        res.json({ success: true, message: 'Đặt lại mật khẩu thành công.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Có lỗi xảy ra.' });
    }
});



module.exports = router;
