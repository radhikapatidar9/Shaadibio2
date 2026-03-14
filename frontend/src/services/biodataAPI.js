import API from "./api"

export const createBiodata = async(data) => {
  const response = await API.post("/biodata/create-biodata", data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
  return response.data;
}

export const getMyBiodatas = async() => {
  const response = await API.get("/biodata/my-biodata", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
  return response.data;
}

export const deleteBiodata = async(id) => {
  const response = await API.delete(`/biodata/delete-biodata/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
  return response.data;
}

export const previewBiodata = async(id) => {
  const response = await API.get(`/biodata/preview/${id}`);
  return response.data;
}

export const downloadPDF = async(id) => {
  const response = await API.get(`/auth/download-pdf/${id}`, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
  return response.data;
}
