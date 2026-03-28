import InfoContentScreen from "@/components/InfoContentScreen";
import { useGetCommonContentQuery } from "@/store/app";
import React from "react";

const Privacy = () => {
  const { data, isLoading } = useGetCommonContentQuery();

  return (
    <InfoContentScreen
      title="Privacy Policy"
      htmlContent={data?.data?.privacyPolicy}
      isLoading={isLoading}
    />
  );
};

export default Privacy;
