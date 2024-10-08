import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import SideBar from '../components/SideBar';
import styles from './styles/Home.module.css'; // Importing the styles
import { GiVillage } from 'react-icons/gi';
import Topbar from '../components/Topbar';
import TableComponent from '../components/TableComponent';
import axios from 'axios';
import Spinner from '../components/Spinner';
import Error from "../components/Error"

function City() {
    const [cityData, setCityData] = useState([]); // Local state for city data
    const [isLoading, setIsLoading] = useState(true); // Local state for loading
    const [isError, setIsError] = useState(false); // Local state for error handling
    const [isAddingNew, setIsAddingNew] = useState(false); // State for adding a new city
    const [cityName, setCityName] = useState(""); // State for city name
    const [cityCode, setCityCode] = useState(""); // State for city code
    const [stateName, setStateName] = useState(""); // State for state name
    const [filterText, setFilterText] = useState(""); // State for filter input

    const handleAddNewClick = () => {
        setIsAddingNew(!isAddingNew);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("https://digitalflake-backend.onrender.com/city/getCity"); // Fetching city data
                const fetchedData = response.data.data.map((item) => ({
                    id: item._id,
                    name: item.name,
                    code: item.code,
                    stateName: item.stateName,
                    status: item.status,
                }));
                setCityData(fetchedData); // Set city data
            } catch (error) {
                console.error("Error fetching city data:", error);
                setIsError(true); // Set error state if fetching fails
            } finally {
                setIsLoading(false); // Set loading state to false after fetching
            }
        };
        fetchData();
    }, []);

    const handleSave = async () => {
        let data = { name: cityName, code: cityCode, stateName }; // Data to be sent
        try {
            const response = await axios.post("https://digitalflake-backend.onrender.com/city/addCity", data); // Add city
            if (response.status === 201) {
                setCityData((prevData) => [
                    ...prevData,
                    { ...data, id: response.data.data._id, status: "Inactive" }, // Update local state
                ]);
                setIsAddingNew(false); // Reset adding state
                setCityName('');
                setCityCode('');
                setStateName('');
            }
        } catch (error) {
            console.error("Error adding city:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`https://digitalflake-backend.onrender.com/city/deleteCity/${id}`); // Delete city
            if (response.status === 200) {
                setCityData((prevData) => prevData.filter((city) => city.id !== id)); // Remove deleted city from state
                console.log("City deleted successfully!");
            }
        } catch (error) {
            console.error("Error deleting city:", error);
        }
    };

    const handleEdit = async (updatedRowData) => {
        try {
            const response = await axios.put(`https://digitalflake-backend.onrender.com/city/updateCity/${updatedRowData.id}`, updatedRowData); // Edit city
            if (response.status === 200) {
                setCityData((prevData) =>
                    prevData.map((city) =>
                        city.id === updatedRowData.id ? updatedRowData : city // Update the edited city
                    )
                );
                console.log("City updated successfully!");
            }
        } catch (error) {
            console.error("Error updating city:", error);
        }
    };

    // Filtering the city data based on the filter text
    const filteredData = cityData.filter(city =>
        city.name?.toLowerCase().includes(filterText.toLowerCase()) ||
        city.code?.toLowerCase().includes(filterText.toLowerCase()) ||
        city.stateName?.toLowerCase().includes(filterText.toLowerCase())
    );

    if (isLoading) return <div> <Spinner /> </div>;
    if (isError) return <div><Error /></div>; // Error state

    return (
        <div>
            <Navbar setFilterText={setFilterText} /> {/* Pass setFilterText to Navbar */}
            <div className={styles.cont}>
                <SideBar />
                <div className={styles.box}>
                    <Topbar
                        Icon={GiVillage}
                        text="City"
                        onAddNew={handleAddNewClick}
                        isAddingNew={isAddingNew}
                        setFilterText={setFilterText}
                    />
                    {!isAddingNew && <TableComponent data={filteredData} onEdit={handleEdit} onDelete={handleDelete} />} {/* Use filtered data */}
                    {isAddingNew && (
                        <div className={styles.inps}>
                            <div className={styles.inp}>
                                <input type="text" placeholder="City Name" value={cityName} onChange={(e) => setCityName(e.target.value)} />
                                <input type="text" placeholder="City Code" value={cityCode} onChange={(e) => setCityCode(e.target.value)} />
                                <input type="text" placeholder="State Name" value={stateName} onChange={(e) => setStateName(e.target.value)} /> {/* New input for state name */}
                            </div>
                            <div >
                                <button className={styles.cancel_button} onClick={() => setIsAddingNew(false)}>Cancel</button>
                                <button className={styles.save_button} onClick={handleSave}>Save</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default City;
