import InfoContentScreen from "@/components/InfoContentScreen";
import { useGetCommonContentQuery } from "@/store/app";
import React from "react";

const Terms = () => {
  const { data, isLoading } = useGetCommonContentQuery();

  return (
    <InfoContentScreen
      title="Terms & Conditions"
      htmlContent={data?.data?.termsAndCondition}
      isLoading={isLoading}
    />
  );
};

export default Terms;
