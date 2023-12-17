import express from 'express';

const app = express();

app.listen(3000, () => {
    console.log('Server corriendo en el puerto 3000');
});