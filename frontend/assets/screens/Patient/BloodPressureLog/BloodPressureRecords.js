let bloodPressureData = [];

export const addData = (systolic, diastolic, date, time, testType) => {
  const newData = {
    systolic,
    diastolic,
    date,
    time,
    testType,
    id: Math.random().toString(),
  };
  bloodPressureData.push(newData);
};

export const getData = () => {
  return bloodPressureData;
};

// export const clearData = () => {
//   bloodPressureData = [];
// };
