const express = require('express');
const app = express();

const port = 3333;
app.listen(port, ()=>{
    console.log('Express backend server is running on port', port);
})