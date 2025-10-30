import React from 'react';
import VaccinationStats from './VaccinationStats';
import VaccinationTable from './VaccinationTable';

const VaccinationInfo = ({ vaccineData }) => {
  return (
    <>
      <VaccinationStats />
      <VaccinationTable data={vaccineData} />
    </>
  );
};

export default VaccinationInfo; 