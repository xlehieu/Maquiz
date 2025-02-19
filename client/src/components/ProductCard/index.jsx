import React from 'react';
import { Card, Typography } from 'antd';
import { VND } from '~/utils';
const { Title } = Typography;
const CardProduct = ({ props }) => {
    const { name, description, price, quantity, thumb, slug } = props;
    return (
        <Card hoverable style={{ width: 260 }} cover={<img alt={name} src={thumb} />}>
            <Title level={5} ellipsis={{ rows: 2 }}>
                {name}
            </Title>
            <div className="flex justify-between items-center">
                <span className="text-primary font-normal text-xl">{VND.format(price)}</span>
                <span>SL: {quantity}</span>
            </div>
        </Card>
    );
};

export default CardProduct;
