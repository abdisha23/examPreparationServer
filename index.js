const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const dotenv = require('dotenv').config();
const dbConnection = require('./config/dbConnection')
const {notFound, errorHandler} = require('./middlewares/errorHandler');
const PORT = process.env.PORT || 4000;
const userRouter = require('./routes/userRoute');
const examRouter = require('./routes/examRoute');
const quizRouter = require('./routes/quizRoute');
const forumRouter = require('./routes/forumRoute');
const courseRouter = require('./routes/courseRoute');
const fileRouter = require('./routes/fileRoute');

const morgan = require('morgan');
const cors = require('cors');


dbConnection();
app.use(cors());
app.use(morgan("dev"));

app.use(express.json()) //For JSON requests
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/api/user', userRouter);
app.use('/api/exam', examRouter);
app.use('/api/quiz', quizRouter);
app.use('/api/forum', forumRouter);
app.use('/api/course', courseRouter);
app.use('/api/course-material', fileRouter);


app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})