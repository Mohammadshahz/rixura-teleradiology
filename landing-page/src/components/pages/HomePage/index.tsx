import Hero from "../../Hero";
import HowItWorks from "../../HowItWorks";
import Features from "../../Features";
import WhyChooseUs from "../../WhyChooseUs";
import Ourmission from "../../OurMission";
import Tutorial from "../../Tutorial";

const Home = () => {
  return (
    <>
      <Hero />
      <Ourmission />
      <HowItWorks />
      <Features />
      <Tutorial />
      <WhyChooseUs />
        {/* <Testimonials /> */}
    </>
  );
};

export default Home;
