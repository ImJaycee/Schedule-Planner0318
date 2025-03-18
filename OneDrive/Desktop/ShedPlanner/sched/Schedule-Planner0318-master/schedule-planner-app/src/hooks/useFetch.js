import { useState, useEffect } from "react";
import axios from "axios";  

const useFetch = (url) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("accessToken"); // Get token
                const res = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` }, // Attach token
                    withCredentials: true, // Ensure cookies are included
                });
                setData(res.data);
            } catch (error) {
                setError(error);
            }
            setLoading(false);
        };
        fetchData();
    }, [url]);

    const refetch = async () => {
        setLoading(true);
        try { 
            const token = localStorage.getItem("accessToken"); // Get token
            const res = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }, // Attach token
                withCredentials: true, // Ensure cookies are included
            });
            setData(res.data);
        } catch (error) {
            setError(error);
        }
        setLoading(false);
    };

    return { data, loading, error, refetch };
};

export default useFetch;
