const express = require("express"); // express 모듈을 가져온다.
const app = express(); // 위 function을 이용해서 새로운 express app을 만든다.
const port = 5000;
const bodyParser = require("body-parser");
const config = require("./config/key");
const { User } = require("./models/User");

// body-parser: 클라이언트에서 오는 정보를 서버에서 분석해서 가져올 수 있게 해주는 거
// application/x-www-form-urlencoded 데이터를 분석해서 가져올 수 있게 해주기 위해서
app.use(bodyParser.urlencoded({ extended: true }));
// application/json 타입으로 된 데이터를 분석해서 가져올 수 있게 해주기 위해서
app.use(bodyParser.json());

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

app.post("/register", (req, res) => {
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

// 5000번 포트에서 앱을 실행을 해준다.
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// mongodb+srv://nana:<password>@cluster0.rpnegaj.mongodb.net/?retryWrites=true&w=majority
