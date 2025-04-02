import axios from "axios";

const CreateShiftRequest = async (shiftData) => {
  try {
    const token = localStorage.getItem("accessToken");
    const department = localStorage.getItem("department");

    // Add department to shiftData
    const requestData = {
      ...shiftData,
      department, // Include department in the payload
    };

    const response = await axios.post(`http://localhost:4000/api/request-shift/create-request`, requestData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      console.log("Request Created:", requestData);
      return response.data; 
    }
  } catch (error) {
    console.error("Error Requesting shift:", error.response?.data?.message || error.message);
    throw error; // Ensure the error is thrown to be caught in `handleSubmit`
  }
};

const ApprovedRequest = async (RequestData) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.put("http://localhost:4000/api/request-shift/approved-request", RequestData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      console.log("Request Approved:", response);
      return response.data; 
    }
  } catch (error) {
    console.error("Error Approving shift:", error.response?.data?.message || error.message);
    throw error; // Ensure the error is thrown to be caught in `handleSubmit`
  }
};

const RejectedRequest = async (RequestData) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.put("http://localhost:4000/api/request-shift/rejected-request", RequestData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      console.log("Request Rejected:", RequestData);
      return response.data; 
    }
  } catch (error) {
    console.error("Error Rejecting shift:", error.response?.data?.message || error.message);
    throw error; // Ensure the error is thrown to be caught in `handleSubmit`
  }
};


const GetRequest = async (userId) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No token found! User may not be logged in.");
      return null;
    }

    const response = await axios.get(`http://localhost:4000/api/request-shift/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching request:", error.response?.data?.message || error.message);
  }
  return null;
};

const GetAllRequest = async (userId) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No token found! User may not be logged in.");
      return null;
    }

    const response = await axios.get(`http://localhost:4000/api/request-shift/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching request:", error.response?.data?.message || error.message);
  }
  return null;
};







export { CreateShiftRequest, ApprovedRequest, RejectedRequest, GetRequest, GetAllRequest };