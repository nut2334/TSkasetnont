import React, { useEffect } from "react";
import axios from "axios";
import SetDataStandard from "./setDataStandard";

const AddStandard = (prop: {
  setSelectedStandard: React.Dispatch<
    React.SetStateAction<
      {
        standard_id: string;
        standard_name: string;
        standard_number: string;
        standard_expire: Date | undefined;
        standard_cercification: File | undefined;
      }[]
    >
  >;
  selectedStandard: {
    standard_id: string;
    standard_name: string;
    standard_number: string;
    standard_expire: Date | undefined;
    standard_cercification: File | undefined;
  }[];
}) => {
  const [standardList, setStandardList] = React.useState<
    {
      standard_id: string;
    }[]
  >([{ standard_id: "" }]);

  return (
    <React.Fragment>
      {standardList.map((option, index) => (
        <SetDataStandard
          index={index}
          setStandardList={setStandardList}
          standardList={standardList}
          setSelectedStandard={prop.setSelectedStandard}
          option={option}
          selectStandard={prop.selectedStandard}
        />
      ))}
    </React.Fragment>
  );
};

export default AddStandard;
