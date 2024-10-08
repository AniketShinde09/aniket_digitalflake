import React from 'react';
import styles from './styles/Spinner.module.css'; // Import the CSS module

const Spinner = () => {
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default Spinner;
