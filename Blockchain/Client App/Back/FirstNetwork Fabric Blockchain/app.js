'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

let network = require('./network.js');

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());


app.get('/queryAllDevicesIdentity', (req, res) => {
    network.queryAllDevicesIdentity()
        .then((response) => {
            let devicesIdentityRecord = JSON.parse(response);
            res.send(devicesIdentityRecord);
        });
});

app.get('/querySingleDeviceIdentity', (req, res) => {
    console.log(req.query.key);
    network.querySingleDeviceIdentity(req.query.key)
        .then((response) => {
            let devicesIdentityRecord = JSON.parse(response);
            res.send(devicesIdentityRecord);
        });
});

app.post('/createDeviceIdentity', (req, res) => {
    console.log(req.body);
    network.queryAllDevicesIdentity()
        .then((response) => {
            console.log(response);
            let devicesIdentityRecord = JSON.parse(response);
            let numDevicesIdentity = devicesIdentityRecord.length;
            let newKey = 'DEVICE_IDENTITY' + numDevicesIdentity;
            network.createDeviceIdentity(newKey, req.body.pubinfo, req.body.hashid, req.body.gatewayid, req.body.state)
                .then((response) => {
                    res.send(response);
                });
        });
});

app.post('/changeDeviceIdentityState', (req, res) => {
    network.changeDeviceIdentityState(req.body.key, req.body.newState)
        .then((response) => {
            res.send(response);
        });
});

app.listen(process.env.PORT || 8081);