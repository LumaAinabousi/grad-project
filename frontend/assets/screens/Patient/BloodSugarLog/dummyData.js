let dummyData = [];

export const addData = (value, testType) => {
  const newData = {
    value: value,
    testType: testType,
    date: new Date().toLocaleString(),  
  };
  dummyData.push(newData);
};

export const getData = () => {
  return dummyData;
};
