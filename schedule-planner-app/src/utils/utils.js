const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");
  
    if (modifier === "PM" && hours !== "12") {
      hours = String(parseInt(hours) + 12);
    } else if (modifier === "AM" && hours === "12") {
      hours = "00";
    }
  
    return `${hours}:${minutes}:00`; // Ensure seconds are included
  };

  export default convertTo24Hour;