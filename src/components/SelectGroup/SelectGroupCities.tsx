import { useEffect, useState } from "react";
import axios from "axios";

interface SelectCityProps {
  selectedState: string;
  selectedCity: string;
  onCityChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectCity: React.FC<SelectCityProps> = ({ selectedState, selectedCity, onCityChange }) => {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    if (!selectedState) return;

    const fetchCities = async () => {
      try {
        const response = await axios.get("/api/cities", { params: { state_id: selectedState } });
        setCities(response.data.data || []);
      } catch (error) {
        console.error("Error fetching cities:", error);
        setCities([]);
      }
    };

    fetchCities();
  }, [selectedState]);

  return (
    <div className="mb-4.5">
    
      <div className="relative z-20 bg-transparent dark:bg-form-input">
        <select
          value={selectedCity || ""}
          onChange={onCityChange}
          name="city_id"
          className="w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
        >
          <option value="" disabled>
            Select City
          </option>
          {cities.map((city) => (
            <option key={city._id} value={city._id}>
              {city.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SelectCity;
