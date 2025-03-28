import axios from "axios";

const CreateShiftSwapRequest = async (requestData) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.post("http://localhost:4000/api/request-shift/create-request/swap", requestData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return response.data; 
    }
  } catch (error) {
    console.error("Error Requesting shift:", error.response?.data?.message || error.message);
    throw error; // Ensure the error is thrown to be caught in `handleSubmit`
  }
};

const AcceptRequest = async (RequestData) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.put("http://localhost:4000/api/request-shift/swap-shift/accept", RequestData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return response.data; 
    }
  } catch (error) {
    console.error("Error Approving shift:", error.response?.data?.message || error.message);
    throw error; // Ensure the error is thrown to be caught in `handleSubmit`
  }
};

const DeclineRequest = async (RequestData) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.put("http://localhost:4000/api/request-shift/swap-shift/decline", RequestData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return response.data; 
    }
  } catch (error) {
    console.error("Error Rejecting shift:", error.response?.data?.message || error.message);
    throw error; // Ensure the error is thrown to be caught in `handleSubmit`
  }
};


const AcceptRequestAdmin = async (RequestData) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.put("http://localhost:4000/api/request-shift/swap-shift/accept/admin", RequestData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return response.data; 
    }
  } catch (error) {
    console.error("Error Approving shift:", error.response?.data?.message || error.message);
    throw error; // Ensure the error is thrown to be caught in `handleSubmit`
  }
};

const DeclineRequestAdmin = async (RequestData) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.put("http://localhost:4000/api/request-shift/swap-shift/decline/admin", RequestData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return response.data; 
    }
  } catch (error) {
    console.error("Error Rejecting shift:", error.response?.data?.message || error.message);
    throw error; // Ensure the error is thrown to be caught in `handleSubmit`
  }
};


const GetSendSwapRequest = async (userId) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No token found! User may not be logged in.");
      return null;
    }

    const response = await axios.get(`http://localhost:4000/api/request-shift/swap-shift/${userId}`, {
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

const GetReceivedSwapRequest = async (userId) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No token found! User may not be logged in.");
      return null;
    }

    const response = await axios.get(`http://localhost:4000/api/request-shift/swap-shift/to-me/${userId}`, {
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

const GetAllSwapRequest = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No token found! User may not be logged in.");
      return null;
    }
    

    const response = await axios.get(`http://localhost:4000/api/request-shift/swap-shift/all/request`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      console.log("Received Data:", response.data); // Debug response
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching request:", error.response?.data?.message || error.message);
  }
  return null;
};



export { 
  CreateShiftSwapRequest, 
  AcceptRequest, 
  DeclineRequest, 
  GetSendSwapRequest, 
  GetReceivedSwapRequest, 
  GetAllSwapRequest, 
  AcceptRequestAdmin,
  DeclineRequestAdmin,
};