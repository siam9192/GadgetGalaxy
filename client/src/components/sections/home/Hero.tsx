"use client";

import Container from "@/components/container/Container";
import HeroCarousel from "@/components/ui/HeroCarousel";

const Hero = () => {
  return (
    <section className="md:py-10 py-6">
      <Container className="lg:grid grid-cols-6 gap-5">
        <div className="col-span-4  relative">
          <HeroCarousel />
        </div>
        <div className="col-span-2 lg:mt-0 mt-5  lg:space-y-2 lg:grid-cols-none grid grid-cols-2 gap-5 ">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqMbIi555SVf3DoMKqLhGxZ9Jr5djyo8EBHQ&s"
            alt=""
            className="w-full"
          />
          <img
            src="https://www.gigabyte.com/FileUpload/Global/News/2248/o202501031910533048.jpg"
            alt=""
            className="w-full "
          />
        </div>
      </Container>
    </section>
  );
};

export default Hero;
