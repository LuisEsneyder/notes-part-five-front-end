import axios from "axios";
const baserUrl = "http://localhost:3001/api/login";

const loging = async (credential) => {
  const response = await axios.post(baserUrl, credential);
  return response.data;
};

export default { loging };
