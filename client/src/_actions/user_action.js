import axios from "axios";
import { LOGIN_USER } from "./types";

export function loginUser(dataToSubmit) {
  const request = axios
    .post("/api/users/login", dataToSubmit)
    .then((response) => response.data); // 서버에서 받은 데이터를 request에 저장한다.

  return {
    type: LOGIN_USER,
    payload: request,
  };
}
