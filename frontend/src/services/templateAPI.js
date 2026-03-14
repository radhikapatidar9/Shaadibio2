import API from "./api"

export const getTemplates = async() => {
  const response = await API.get("/template/templates");
  return response.data;
}
