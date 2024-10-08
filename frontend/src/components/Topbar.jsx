import React from 'react';
import style from "../pages/styles/state.module.css";
import { AiOutlineArrowLeft } from "react-icons/ai"; // Import a back arrow icon

function Topbar({ Icon, text, onAddNew, isAddingNew, setFilterText }) {
    const handleFilterChange = (event) => {
        setFilterText(event.target.value); // Update filter text based on input
    };
    return (
        <div className={style.top}>
            <div className={style.left}>
                {isAddingNew && (
                    <AiOutlineArrowLeft  onClick={onAddNew }  color='#E0E0E0' style={{ cursor: 'pointer' }} />
                )}
                {!isAddingNew && (
                    <>
                        <Icon />
                        <p>{text}</p>
                    </>
                )}
            </div>
            <div className={style.mid}>
                {!isAddingNew && <input type="text" placeholder='Search...' onChange={handleFilterChange} />}
            </div>
            <div className={style.right}>
                {!isAddingNew && <button onClick={onAddNew}>Add New</button>}
            </div>
        </div>
    );
}

export default Topbar;
