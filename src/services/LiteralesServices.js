import axios from 'axios';

const LiteralesServices = {};

LiteralesServices.get = async ({ model }) => {
  const { data } = await axios.get(`literales/${model}/all`);
  return data;
};

export default LiteralesServices;
