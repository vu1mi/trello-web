import axios from "axios";
import { API_ROOT } from "~/utils/constants";

export const fetchBoardDetailAPI = async (boardId) => {
  try {
    const response = await axios.get(`${API_ROOT}/v1/board/${boardId}`);
    return response.data;
  }
  catch (error) {
    console.error("Error fetching board data:", error);
    throw error;
  }
};

export const createColumnAPI = async (columnData) => {
  try {
    const response = await axios.post(`${API_ROOT}/v1/column`,
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
    const response = await axios.put(`${API_ROOT}/v1/column/${columnId}`, {
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
    const response = await axios.delete(`${API_ROOT}/v1/column/${columnId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting column:", error);
    throw error;
  }
};
export const createCardAPI = async (cardData) => {
  try {
    const response = await axios.post(`${API_ROOT}/v1/card`, cardData);
    return response.data;
  } catch (error) {
    console.error("Error creating card:", error);
    throw error;
  }
};