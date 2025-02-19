import React from 'react';
import { useParams } from 'react-router-dom';

const ClassroomDetail = () => {
    const { classCode } = useParams();
    return <div>{classCode}</div>;
};

export default ClassroomDetail;
