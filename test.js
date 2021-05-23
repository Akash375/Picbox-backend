const axios = require("axios")

const data = {

}

axios.get("http://localhost:3001/")
.then((res) => {
    console.log(res.data);
})
.catch((err) => {
    console.log(err.response.data);
})