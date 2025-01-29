const express = require('express');

const app = express();

app.listen(7777,()=>{
    console.log('Server is running on port 7777');
})

app.get('/', (req, res) => {
    res.send('Hello Woraald!');
});

app.get('/about', (req, res) => {
    res.send('This is the About Page');
});