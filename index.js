require("dotenv").config();
const express = require("express");

const servidor = express();


servidor.listen(process.env.PORT);
//para cuando lo subamos a internet 
//en el que subamos a internet no hace falta el env