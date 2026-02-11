import axios from "axios";

export const fetchMenuApi = () => {
  return axios.get("http://localhost:3000/menu");
};
