import authorizeAxios from "~/utils/authorizeAxios";
import { API_ROOT } from "~/utils/constants";


export const createColumnAPI = async (columnData) => {
  try {
    const response = await authorizeAxios.post(`${API_ROOT}/v1/column`,
      columnData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating column:", error);
    throw error;
  }
};

export const updateColumnAPI = async (columnId, columnName) => {
  try {
    const response = await authorizeAxios.put(`${API_ROOT}/v1/column/${columnId}`, {
      name: columnName,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating column:", error);
    throw error;
  }
};

export const deleteColumnAPI = async (columnId) => {
  try {
    const response = await authorizeAxios.delete(`${API_ROOT}/v1/column/${columnId}`);
    return response;
  } catch (error) {
    console.error("Error deleting column:", error);
    throw error;
  }
};
export const createCardAPI = async (cardData) => {
  try {
    const response = await authorizeAxios.post(`${API_ROOT}/v1/card`, cardData);
    return response.data;
  } catch (error) {
    console.error("Error creating card:", error);
    throw error;
  }
};
export const updateCardAPI = async (cardId, cardName) => {
  try {
    const response = await authorizeAxios.patch(`${API_ROOT}/v1/card/${cardId}`, {
      title: cardName,
    });
    return response;
  } catch (error) {
    console.error("Error updating card:", error);
    throw error;
  }
};
 export const deleteCardApi  = async (cardId) => {
  try {
    const response = await authorizeAxios.delete(`${API_ROOT}/v1/card/${cardId}`);
    return response;
  } catch (error) {
    console.error("Error deleting card:", error);
    throw error;
  }
};

//user
export const registerAPI = async (userData) => {
    const response = await authorizeAxios.post(`${API_ROOT}/v1/user/register`, userData);
    return response.data;
}

export const verifyAccountAPI = async (verificationData) => {
    const response = await authorizeAxios.put(`${API_ROOT}/v1/user/verification`, verificationData);
    return response.data;
}

export const refreshTokenAPI = async () => {
    const response = await authorizeAxios.get(`${API_ROOT}/v1/user/refresh_token`);
    return response.data;
}