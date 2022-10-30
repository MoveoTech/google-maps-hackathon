import axios from "axios";
import { IUser } from "../types";

const baseUrl = "https://dayway-server.herokuapp.com";

export const addUser = ({
  email,
  username,
  picture,
}: Pick<IUser, "email" | "username" | "picture">): Promise<IUser> => {
  const data = {
    email,
    username,
    picture,
  };
  return axios.post(`${baseUrl}/users`, data);
};
