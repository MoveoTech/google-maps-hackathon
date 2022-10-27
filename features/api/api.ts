import axios from "axios";

const baseUrl = "https://dayway-server.herokuapp.com/";

export const testApi = () => {
  return axios.get(baseUrl);
};
