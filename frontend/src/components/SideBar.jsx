import React from 'react';
import styles from "./sidebar.module.css";
import { IoHomeOutline } from "react-icons/io5";
import { BiSolidRightArrow } from "react-icons/bi";
import { GiHutsVillage, GiVillage } from "react-icons/gi";
import { LuWarehouse } from "react-icons/lu";
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { TOGGLE_PAGE } from '../redux/actionType'; // Import your action type

function SideBar() {
    const dispatch = useDispatch(); // Initialize the dispatch function
    const activePage = useSelector((state) => state.activePage); // Get the active page from the Redux state
    let arr = [
        { fsimg: <IoHomeOutline />, p: "Home", lstimg: <BiSolidRightArrow /> },
        { fsimg: <GiVillage />, p: "State", lstimg: <BiSolidRightArrow /> },
        { fsimg: <GiHutsVillage />, p: "City", lstimg: <BiSolidRightArrow /> },
        { fsimg: <LuWarehouse />, p: "WareHouse", lstimg: <BiSolidRightArrow /> }
    ];

    const handleNavClick = (page) => {
        console.log(page);
        dispatch({ type: TOGGLE_PAGE, payload: page }); // Dispatch the TOGGLE_PAGE action
    };

    return (
        <div>
            <div className={styles.box}>
                <div className={styles.blocks}>
                    {arr.map((el, index) => (
                        <NavLink to={`/${el.p}`} key={index} onClick={() => handleNavClick(el.p)}> 
                            <div className={`${styles.block} ${activePage === el.p ? styles.active : ''}`} key={index}>
                                {el.fsimg}
                                <p>{el.p}</p>
                                {el.lstimg}
                            </div>
                        </NavLink>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SideBar;
