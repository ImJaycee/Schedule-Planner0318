import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext"; // adjust path if needed

const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { dispatch } = useContext(AuthContext); // 👈 Get dispatch

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setData(res.data);
    } catch (err) {
      if (err.response?.status === 429 && err.response?.data?.forceLogout) {
        alert(
          err.response.data.message ||
            "Too many requests, try again later. Logging out."
        );
        dispatch({ type: "LOGOUT" });
        localStorage.removeItem("accessToken");
        return;
      }
      setError(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [url]);

  const refetch = async () => {
    await fetchData();
  };

  return { data, loading, error, refetch };
};

export default useFetch;
