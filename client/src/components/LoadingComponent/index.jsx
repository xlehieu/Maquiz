import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { ClockLoader } from 'react-spinners';
import { colors } from '~/constants';
const LoadingComponent = () => {
    return (
        <div className="w-full h-screen relative">
            <ClockLoader color={colors.primary} size={100} className="absolute mx-auto top-1/2 -translate-y-full" />
        </div>
    );
};

export default LoadingComponent;
