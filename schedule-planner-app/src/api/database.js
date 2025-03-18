import axios from "axios";

const CreateShift = async (shiftData) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.post("http://localhost:4000/api/shift/create", shiftData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      console.log("Shift Created:", shiftData);
    }
  } catch (error) {
    console.error("Error creating shift:", error.response?.data?.message || error.message);
  }
};


const UpdateShift = async (shiftData, shiftId) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.put(`http://localhost:4000/api/shift/${shiftId}`, shiftData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      console.log("Shift Updated:", shiftData);
      return response.data;
    }
  } catch (error) {
    console.error("Error updating shift:", error.response?.data?.message || error.message);
    throw error; // Re-throw error for handling in `handleSubmit`
  }
};

const DeleteShift = async (shiftId) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.delete(`http://localhost:4000/api/shift/${shiftId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error updating shift:", error.response?.data?.message || error.message);
    throw error; // Re-throw error for handling in `handleSubmit`
  }
};


export { CreateShift, UpdateShift, DeleteShift };