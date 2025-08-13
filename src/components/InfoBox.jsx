import React from 'react';
import '../styles/InfoBox.css';

const InfoBox = ({ title, count, icon, color }) => {
  return (
    <div className={`info-box ${color} fade-in-up`}>
      <div className="info-box-icon">
        {icon}
      </div>
      <div className="info-box-content">
        <h3 className="info-box-title">{title}</h3>
        <div className="info-box-count">{count}</div>
      </div>
    </div>
  );
};

export default InfoBox;
