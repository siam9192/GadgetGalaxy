import Banner from "@/components/sections/home/Banner";
import BestDeals from "@/components/sections/home/BestDeals";
import FeaturedCategories from "@/components/sections/home/FeaturedCategories";
import FeaturedProducts from "@/components/sections/home/FeaturedProducts";
import Hero from "@/components/sections/home/Hero";
import NewArrival from "@/components/sections/home/NewArrival";
import OurServices from "@/components/sections/home/OurServices";
import ShopByBrands from "@/components/sections/home/ShopByBrands";
import TopBrandProducts from "@/components/sections/home/TopBrandProducts";

export default function Home() {

  return (
    <div>
      <Hero />
      <FeaturedProducts />
      <Banner />
      <FeaturedCategories />
      <NewArrival />
      <OurServices />
      <TopBrandProducts />
      <ShopByBrands />
      <BestDeals />
    </div>
  );
}
