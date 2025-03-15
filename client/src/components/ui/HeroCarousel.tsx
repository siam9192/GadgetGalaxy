import React from "react";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
const sliderImages = [
  "https://img.freepik.com/premium-psd/black-friday-sale-laptops-gadgets-banner-template-3d-render_444361-44.jpg",
  "https://www.euronics.co.uk/medias/lg-brand-page-hero-image?context=bWFzdGVyfGltYWdlc3w0NjQ5MTh8aW1hZ2UvanBlZ3xhVzFoWjJWekwyZ3pOeTlvWVRJdk9EazBNVEE0T1RrNE1EUTBOaTVxY0djfDI0YTE2ZGJhOTU1MjQ2ZmFjOTVlMzNiYWYwNDAxOTgxN2RhZjZmNTMxMjhhNWZhNjc2Zjk3YTZiNDQ3MjdiMWI",
  "https://www.notebookcheck.net/fileadmin/Notebooks/News/_nc3/m1_macs_banner.jpg",
];
const HeroCarousel = () => {
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  const CustomRightArrow = ({ onClick, ...rest }: any) => {
    const {
      onMove,
      carouselState: { currentSlide, deviceType },
    } = rest;
    return (
      <button
        className={` bg-secondary lg:text-2xl text-xl  text-black p-3 rounded-full absolute top-1/2 right-2`}
        onClick={() => onClick()}
      >
        <SlArrowRight />
      </button>
    );
  };

  const CustomLeftArrow = ({ onClick, ...rest }: any) => {
    const {
      onMove,
      carouselState: { currentSlide, deviceType },
    } = rest;
    return (
      <button
        className={` bg-secondary lg:text-2xl text-xl  text-black p-3 rounded-full absolute top-1/2 left-2`}
        onClick={() => onClick()}
      >
        <SlArrowLeft />
      </button>
    );
  };

  return (
    <Carousel
      swipeable={true}
      draggable={true}
      showDots={false}
      responsive={responsive}
      ssr={false}
      infinite={true}
      autoPlay={true}
      autoPlaySpeed={3000}
      keyBoardControl={true}
      customTransition="transform 300ms ease-in-out"
      transitionDuration={500}
      rewind
      rewindWithAnimation
      minimumTouchDrag={20}
      customRightArrow={<CustomRightArrow />}
      customLeftArrow={<CustomLeftArrow />}
    >
      {sliderImages.map((img, index) => (
        <img src={img} key={index} className=" lg:h-full h-60 " />
      ))}
    </Carousel>
  );
};

export default HeroCarousel;
