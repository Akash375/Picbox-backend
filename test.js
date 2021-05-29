const axios = require("axios")

const data = {
    username: 'test123',
    email: 'test125345@test.com',
    password: '123456',
    name: 'test'
};

axios.post("http://localhost:3001/auth/register", data)
.then((res) => {
    console.log(res.data);
})
.catch((err) => {
    console.log(err.response.data);
})