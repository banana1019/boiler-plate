const express = require("express"); // express 모듈을 가져온다.
const app = express(); // 위 function을 이용해서 새로운 express app을 만든다.
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key");
const { auth } = require("./middleware/auth");
const { User } = require("./models/User");

// body-parser: 클라이언트에서 오는 정보를 서버에서 분석해서 가져올 수 있게 해주는 거

// application/x-www-form-urlencoded 데이터를 분석해서 가져올 수 있게 해주기 위해서
app.use(bodyParser.urlencoded({ extended: true })); //

// application/json 타입으로 된 데이터를 분석해서 가져올 수 있게 해주기 위해서
app.use(bodyParser.json());
app.use(cookieParser());

// mongoose 모듈을 가져와서 어플리케이션과 mongoDB를 연결한다.
const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI)
  .then(() => console.log("mongoDB Connected..."))
  .catch((err) => console.log(err));

// root 디렉토리에 오면 'Hello World'를 출력해준다.
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/hello", (req, res) => {
  res.send("안녕하슈");
});

app.post("/api/users/register", (req, res) => {
  // 회원가입할 때 필요한 정보들을 client 에서 가져오면
  // 그것들을 데이터베이스에 넣어준다.
  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.post("/api/users/login", (req, res) => {
  // 요청된 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }
    // 요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인한다.
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다.",
        });

      // 비밀번호까지 맞다면 토큰을 생성한다.
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        // 토큰을 저장한다. 어디에? 쿠키, 로컬스토리지 등등
        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

app.get("/api/users/auth", auth, (req, res) => {
  // 여기까지 미들웨어를 통과해왔다는 얘기는 Authentication이 True 라는 말.
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
    });
  });
});

const port = 5000;

// 5000번 포트에서 앱을 실행을 해준다.
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// mongodb+srv://nana:<password>@cluster0.rpnegaj.mongodb.net/?retryWrites=true&w=majority
