let dummyData = [];

export const addData = (medicine, dosage, date, time, bloodSugar, testType) => {
  const newRecord = {
    medicine,
    dosage,
    date,
    time,
    bloodSugar,
    testType,
    id: Math.random().toString(),
  };
  dummyData.push(newRecord);
};

export const getData = () => {
  return dummyData;
};
