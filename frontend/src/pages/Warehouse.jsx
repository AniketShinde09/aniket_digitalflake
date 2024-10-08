import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import SideBar from '../components/SideBar';
import styles from './styles/Home.module.css'; // Importing the styles
import { LuWarehouse } from 'react-icons/lu';
import Topbar from '../components/Topbar';
import TableComponent from '../components/TableComponent'; // Assuming TableComponent is reusable
import axios from 'axios';
import Spinner from '../components/Spinner';
import Error from "../components/Error"

function Warehouse() {
    const [warehouseData, setWarehouseData] = useState([]); // Local state for warehouse data
    const [isLoading, setIsLoading] = useState(true); // Local state for loading
    const [isError, setIsError] = useState(false); // Local state for error handling
    const [isAddingNew, setIsAddingNew] = useState(false); // State for adding a new warehouse
    const [warehouseName, setWarehouseName] = useState(""); // State for warehouse name
    const [warehouseState, setWarehouseState] = useState(""); // State for warehouse state
    const [warehouseCity, setWarehouseCity] = useState(""); // State for warehouse city
    const [filterText, setFilterText] = useState(""); // State for filter input

    const handleAddNewClick = () => {
        setIsAddingNew(!isAddingNew);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("https://digitalflake-backend.onrender.com/warehouse/getWarehouse"); // Fetching warehouse data
                const fetchedData = response.data.data.map((item) => ({
                    id: item._id,
                    name: item.name,
                    state: item.state,
                    city: item.city,
                    status: item.status,
                }));
                setWarehouseData(fetchedData); // Set warehouse data
            } catch (error) {
                console.error("Error fetching warehouse data:", error);
                setIsError(true); // Set error state if fetching fails
            } finally {
                setIsLoading(false); // Set loading state to false after fetching
            }
        };
        fetchData();
    }, []);

    const handleSave = async () => {
        let data = { name: warehouseName, state: warehouseState, city: warehouseCity }; // Data to be sent
        try {
            const response = await axios.post("https://digitalflake-backend.onrender.com/warehouse/addWarehouse", data); // Add warehouse
            if (response.status === 201) {
                setWarehouseData((prevData) => [
                    ...prevData,
                    { ...data, id: response.data.data._id, status: "Inactive" }, // Update local state
                ]);
                setIsAddingNew(false); // Reset adding state
                setWarehouseName('');
                setWarehouseState('');
                setWarehouseCity('');
            }
        } catch (error) {
            console.error("Error adding warehouse:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`https://digitalflake-backend.onrender.com/warehouse/deleteWarehouse/${id}`); // Delete warehouse
            if (response.status === 200) {
                setWarehouseData((prevData) => prevData.filter((warehouse) => warehouse.id !== id)); // Remove deleted warehouse from state
                console.log("Warehouse deleted successfully!");
            }
        } catch (error) {
            console.error("Error deleting warehouse:", error);
        }
    };

    const handleEdit = async (updatedRowData) => {
        try {
            const response = await axios.put(`https://digitalflake-backend.onrender.com/warehouse/updateWarehouse/${updatedRowData.id}`, updatedRowData); // Edit warehouse
            if (response.status === 200) {
                setWarehouseData((prevData) =>
                    prevData.map((warehouse) =>
                        warehouse.id === updatedRowData.id ? updatedRowData : warehouse // Update the edited warehouse
                    )
                );
                console.log("Warehouse updated successfully!");
            }
        } catch (error) {
            console.error("Error updating warehouse:", error);
        }
    };

    // Filtering the warehouse data based on the filter text
    const filteredData = warehouseData.filter(warehouse =>
        warehouse.name?.toLowerCase().includes(filterText.toLowerCase()) ||
        warehouse.state?.toLowerCase().includes(filterText.toLowerCase()) ||
        warehouse.city?.toLowerCase().includes(filterText.toLowerCase())
    );

    if (isLoading) return <div> <Spinner /> </div>;
    if (isError) return <div><Error />      </div>; // Error state

    return (
        <div>
            <Navbar setFilterText={setFilterText} /> {/* Pass setFilterText to Navbar */}
            <div className={styles.cont}>
                <SideBar />
                <div className={styles.box}>
                    <Topbar
                        Icon={LuWarehouse}
                        text="Warehouse"
                        onAddNew={handleAddNewClick}
                        isAddingNew={isAddingNew}
                        setFilterText={setFilterText}
                    />
                    {!isAddingNew && <TableComponent data={filteredData} onEdit={handleEdit} onDelete={handleDelete} />} {/* Use filtered data */}
                    {isAddingNew && (
                        <div className={styles.inps}>
                            <div className={styles.inp}>
                                <input type="text" placeholder="Warehouse Name" value={warehouseName} onChange={(e) => setWarehouseName(e.target.value)} />
                                <input type="text" placeholder="State" value={warehouseState} onChange={(e) => setWarehouseState(e.target.value)} />
                                <input type="text" placeholder="City" value={warehouseCity} onChange={(e) => setWarehouseCity(e.target.value)} />
                            </div>
                            <div className={styles.buts}>
                                <button className='cancel_button' onClick={() => setIsAddingNew(false)}>Cancel</button>
                                <button onClick={handleSave}>Save</button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default Warehouse;
