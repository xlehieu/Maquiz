import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routers';
import * as database from './config';
import cookieParser from 'cookie-parser';
import session from 'express-session';
dotenv.config();
const app = express();
const port = process.env.PORT;
database.connect();
//dung lượng tối đa mà client có thể submit lên server
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

//session là cái để mình kiểm soát được trạng thái của người dùng
app.use(
    session({
        secret: String(process.env.SESSION_SECRET),
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, secure: false }, // 10 minutes
    }),
);
const allowedOrigins = [String(process.env.ALLOW_ORIGIN)];
const corsOptions = {
    origin: allowedOrigins,
    credentials: true, // Nếu cần gửi cookie, JWT
};
app.use(express.json({ limit: '30mb' }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(corsOptions));
routes(app);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
