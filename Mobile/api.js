import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5271',
});

const registrar = async () => {
  try {
    const response = await api.post('/Auth/registrar', {
      nome: 'João',
      email: 'joao@email.com',
      senha: '123456'
    });
    console.log(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
};
