// client/src/components/common/Spinner.js
import React from 'react';
import './Spinner.css'; // Add CSS for styling

const Spinner = () => {
    return (
        <div className="spinner-overlay">
            <div className="spinner"></div>
        </div>
    );
};

export default Spinner;