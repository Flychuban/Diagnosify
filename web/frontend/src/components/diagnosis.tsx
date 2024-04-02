import React from "react";
import {
  Diagnosis,
  ModelEnum,
} from "../../../backend/diagnosis_service/src/db_repo";
export const DiagnosisComponent: React.FC<{ diagnosis: Diagnosis }> = ({
  diagnosis,
}) => {
  return (
    <>
      <h1>Type:{diagnosis.type}</h1>
      <h1>{diagnosis.is_correct}</h1>
    </>
  );
};
