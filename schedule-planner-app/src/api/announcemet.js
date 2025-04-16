import axios from "axios";

const GetAnnouncement = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No token found! User may not be logged in.");
      return null;
    }

    const response = await axios.get("http://localhost:4000/api/announcements/active/announcement", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
     
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching announcements:", error.response?.data?.message || error.message);
  }
  return null;
};

export { GetAnnouncement };
