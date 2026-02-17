import InfoContentScreen from "@/components/InfoContentScreen";
import React from "react";

export const options = {
  tabBarStyle: { display: "none" },
};

const About = () => {
  const aboutData = [
    "Lorem ipsum dolor sit amet consectetur. Imperdiet iaculis convallis bibendum massa id elementum consectetur neque mauris.",
    "Lorem ipsum dolor sit amet consectetur. Imperdiet iaculis convallis bibendum massa id elementum consectetur neque mauris.",
    "Lorem ipsum dolor sit amet consectetur. Imperdiet iaculis convallis bibendum massa id elementum consectetur neque mauris.",
    "Lorem ipsum dolor sit amet consectetur. Imperdiet iaculis convallis bibendum massa id elementum consectetur neque mauris.",
    "Lorem ipsum dolor sit amet consectetur. Imperdiet iaculis convallis bibendum massa id elementum consectetur neque mauris.",
  ];

  return <InfoContentScreen title="About Us" data={aboutData} />;
};

export default About;
