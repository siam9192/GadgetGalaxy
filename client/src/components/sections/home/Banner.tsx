import Container from "@/components/container/Container";
import React from "react";

const Banner = () => {
  return (
    <section className="lg:py-10 py-5">
      <Container className="grid md:grid-cols-2 gap-5">
        <img
          src="https://adminapi.applegadgetsbd.com/storage/media/large/pixel-9-7678.jpg"
          alt=""
        />
        <img
          src="https://adminapi.applegadgetsbd.com/storage/media/large/MacBook-Air-M2-1847.jpg"
          alt=""
        />
      </Container>
    </section>
  );
};

export default Banner;
