import InfoContentScreen from "@/components/InfoContentScreen";
import { useGetCommonContentQuery } from "@/store/app";
import React from "react";

export const options = {
  tabBarStyle: { display: "none" },
};

const About = () => {
  const { data, isLoading } = useGetCommonContentQuery();

  return (
    <InfoContentScreen
      title="About Us"
      htmlContent={data?.data?.aboutUs}
      isLoading={isLoading}
    />
  );
};

export default About;
