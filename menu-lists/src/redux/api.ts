import axios from "axios";

export const fetchMenuApi = () => {
  return axios.get("http://localhost:3000/menu");
};

export const updateThemeApi = (themeData: any) => {
  console.log("Saving Theme Data:", themeData);
  return axios.put("http://localhost:3000/theme", themeData, {
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 5000, // 5 seconds timeout
  });
};

export const fetchDisplaysApi = () => {
  return axios.get("http://localhost:3000/displays");
};

export const createDisplayApi = (displayData: any) => {
  return axios.post("http://localhost:3000/displays", displayData);
};

export const deleteDisplayApi = (id: number | string) => {
  return axios.delete(`http://localhost:3000/displays/${id}`);
};
