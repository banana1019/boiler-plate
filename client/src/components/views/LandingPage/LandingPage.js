import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  let navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/hello").then((response) => {
      console.log(response);
    });
  }, []);

  const onClickHandler = () => {
    axios.get("/api/users/logout").then((response) => {
      // console.log(response.data);
      if (response.data.success) {
        navigate("/login");
      } else {
        alert("로그아웃 실패!");
      }
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <h2>시작 페이지</h2>

      <button onClick={onClickHandler}>로그아웃</button>
    </div>
  );
}

export default LandingPage;
