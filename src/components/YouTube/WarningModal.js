import React from 'react';
import './WarningModal.css'; // Create a CSS file for styling

const WarningModal = ({ message, flaggedContent, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Warning</h2>
                <p>{message}</p>
                <div className="flagged-content">
                    {flaggedContent.map((item, index) => (
                        <div key={index} className="flagged-item">
                            <p><strong>Text:</strong> {item.text}</p>
                            <p><strong>Categories:</strong> {Object.keys(item.toxic_categories).join(', ')}</p>
                        </div>
                    ))}
                </div>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default WarningModal; 