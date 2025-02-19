import React from 'react';
import Slider from 'react-slick';
import { Image } from 'antd';
import { Link } from 'react-router-dom';
const SliderComponent = ({ arrImages = [] }) => {
    var settings = {
        dots: true,
        infinite: true,
        accessibility: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1900,
        pauseOnHover: true,
        pauseOnFocus: true,
        swipe: true,
        swipeToSlide: true,
    };
    return (
        <Slider {...settings}>
            {arrImages.map((image, index) => (
                <div key={index}>
                    <Link to={image}>
                        <Image src={image} preview={false} width={'100%'} alt={image} />
                    </Link>
                </div>
            ))}
        </Slider>
    );
};

export default SliderComponent;
