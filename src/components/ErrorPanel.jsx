import React from 'react';

const ErrorPanel = ({ errors }) => {
    // Use a Set to collect unique error descriptions
    const uniqueDescriptions = new Set(errors.map(error => error.description));

    return (
        <div className="error-panel">
            {uniqueDescriptions.size > 0 ? (
                <ul>
                    {[...uniqueDescriptions].map((description, index) => (
                        <li key={index}>{description}</li>
                    ))}
                </ul>
            ) : (
                <p>No errors found.</p>
            )}
        </div>
    );
}

export default ErrorPanel;
