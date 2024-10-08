import React from 'react';
import styles from './styles/error.module.css'; // Import the CSS file for styling

function Error() {
    return (
        <div className={styles.errorContainer}>
            <h1 className={styles.errorMessage}>Something went wrong</h1>
            <p className={styles.errorDescription}>Please try again</p>
        </div>
    );
}

export default Error;
