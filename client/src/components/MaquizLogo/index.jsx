import React from 'react';
const maquizLogo = require('~/asset/image/Maquiz.png');
const MaquizLogo = ({ ...props }) => {
    return <img {...props} src={maquizLogo} alt="logo" />;
};

export default MaquizLogo;
