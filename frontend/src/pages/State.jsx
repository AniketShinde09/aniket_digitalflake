import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import SideBar from '../components/SideBar';
import styles from "./styles/Home.module.css";
import { GiVillage } from "react-icons/gi";
import Topbar from '../components/Topbar';
import TableComponent from '../components/TableComponent';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { addState,  deleteState, editState, storeStateData } from '../redux/action';
import Spinner from '../components/Spinner';
import Error from "../components/Error"

function State() {
    const dispatch = useDispatch();
    const stateData = useSelector((state) => state.stateData);
    const isLoading = useSelector((state) => state.isLoading);
    const isError = useSelector((state) => state.isError);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [stateName, setStateName] = useState("");
    const [stateCode, setStateCode] = useState("");
    const [filterText, setFilterText] = useState(""); // Step 1: Create state for filter input

    const handleAddNewClick = () => {
        setIsAddingNew(!isAddingNew);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("https://digitalflake-backend.onrender.com/state/getState");
                const fetchedData = response.data.data.map((item) => ({
                    id: item._id,
                    name: item.name,
                    code: item.code,
                    status: item.status,
                }));
                dispatch(storeStateData(fetchedData));
            } catch (error) {
                console.error("Error fetching state data:", error);
            }
        };
        fetchData();
    }, [dispatch]);

    const handleSave = async () => {
        let data = { name: stateName, code: stateCode };
        try {
            const response = await dispatch(addState(data))
            if (response.status === 201) {
                setIsAddingNew(false);
                setStateName('');
                setStateCode('');
            }
        } catch (error) {
            console.error("Error adding state:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await dispatch(deleteState(id)); // Dispatch delete action
            if (response.status === 200) {
                console.log("State deleted successfully!");
            }
        } catch (error) {
            console.error("Error deleting state:", error);
        }
    };
    

    const handleEdit = async (updatedRowData) => {
        try {
            const response = await dispatch(editState(updatedRowData)); // Dispatch edit action
            if (response.status === 200) {
                console.log("State updated successfully!");
            }
        } catch (error) {
            console.error("Error updating state:", error);
        }
    };
    

    // Step 2: Filter the state data based on the filter text
    const filteredData = stateData.filter(state =>
        state.name?.toLowerCase().includes(filterText.toLowerCase()) ||
        state.code?.toLowerCase().includes(filterText.toLowerCase())
        // || state.id.toLowerCase().includes(filterText.toLowerCase())
    );

    if (isLoading) return <div> <Spinner /> </div>;
    if (isError) return <div><Error /></div>;
    if (isError) return <div><Error /></div>;

    return (
        <div>
            <Navbar setFilterText={setFilterText} /> {/* Pass setFilterText to Navbar */}
            <div className={styles.cont}>
                <SideBar />
                <div className={styles.box}>
                    <Topbar
                        Icon={GiVillage}
                        text="State"
                        onAddNew={handleAddNewClick}
                        isAddingNew={isAddingNew}
                        setFilterText={setFilterText}
                    />
                    {!isAddingNew && <TableComponent data={filteredData} onEdit={handleEdit} onDelete={handleDelete} />} {/* Use filtered data */}
                    {isAddingNew && (
                        <div className={styles.inps}>
                            <div className={styles.inp}>
                                <input type="text" placeholder="State Name" value={stateName} onChange={(e) => setStateName(e.target.value)} />
                                <input type="text" placeholder="State Code" value={stateCode} onChange={(e) => setStateCode(e.target.value)} />
                            </div>
                            <div className={styles.buts} >
                                <button onClick={() => setIsAddingNew(false)}>Cancel</button>
                                <button onClick={handleSave}>Save</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default State;
