
export async function getAllData(url, endpoint) {
    try {
      const response = await axios.get(url + endpoint);
      console.log("STATUS CODE: ", response.status);
      return response.data; 
    } catch (error) {
      console.error(error.message);
      throw error; 
    }
  }

  export async function getDataById(url, endpoint, id) {
    try {
      const response = await axios.get(`${url}${endpoint}?id=${id}`);
      console.log("STATUS CODE: ", response.status);
      return response.data;
    } catch (error) {
      console.error(error.message);
      throw error; 
    }
  }

  export async function deleteDataById(url, endpoint, id) {
    try {
      const response = await axios.delete(`${url}${endpoint}/${id}`);
      console.log("STATUS CODE: ", response.status);
      return response.data; 
    } catch (error) {
      console.error(error.message);
      throw error; 
    }
  }