import React from 'react'
import Navbar from '../components/Navbar'
import SideBar from '../components/SideBar'
import styles from "./styles/Home.module.css"

function Home() {
    return (
        <div>
            <Navbar />
            <div className={styles.cont} >
                <SideBar />
                <div className={styles.box} >
                    <div className={styles.main} >
                        <img src="https://digitalflake.com/wp-content/uploads/2023/04/DF_logo-transparent2.png" alt="" />
                        <p>Welcome to Digitalflake admin</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
