// const responseHandler = require('./response-handler');
import responseHandler from "./response-handler.js";

// const express = require('express');
import express from 'express';

const app = express();

app.get('/', responseHandler);

app.listen(3000);
