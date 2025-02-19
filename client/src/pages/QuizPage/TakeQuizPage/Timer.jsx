import React, { memo } from 'react';
import { useTimer } from 'react-timer-hook';
const Timer = ({ setIsEnded }) => {
    const endTime = new Date();
    endTime.setSeconds(endTime.getSeconds() + 10);
    const { seconds, minutes, hours } = useTimer({
        expiryTimestamp: endTime,
        onExpire: () => setIsEnded(true),
    });
    return (
        <p className="text-xl font-bold text-primary">
            {hours.toString().padStart(2, '0')}
            <span className="mx-2">:</span>
            {minutes.toString().padStart(2, '0')}
            <span className="mx-2">:</span>
            {seconds.toString().padStart(2, '0')}
        </p>
    );
};
export default memo(Timer);
