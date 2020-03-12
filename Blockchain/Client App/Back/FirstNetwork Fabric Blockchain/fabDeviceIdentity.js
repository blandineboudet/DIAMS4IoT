/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class FabDeviceIdentity extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const deviceIdentity = [
            {
                pubinfo: 'capteur1',
                hashid: '',
                gatewayid: '',
                state: 'authenticated',
            },
            {
                pubinfo: 'capteur2',
                hashid: '',
                gatewayid: '',
                state: 'waiting',
            },
            {
                 pubinfo: 'capteur3',
                hashid: '',
                gatewayid: '',
                state: 'recorded',
            },
            {
                 pubinfo: 'capteur4',
                hashid: '',
                gatewayid: '',
                state: 'recorded',
            },
            {
                pubinfo: 'capteur5',
                hashid: '',
                gatewayid: '',
                state: 'recorded',
            },
            {
                pubinfo: 'capteur6',
                hashid: '',
                gatewayid: '',
                state: 'waiting',
            },
            {
                pubinfo: 'capteur7',
                hashid: '',
                gatewayid: '',
                state: 'authenticated',
            },
            {
                 pubinfo: 'capteur8',
                hashid: '',
                gatewayid: '',
                state: 'recorded',
            },
            {
                 pubinfo: 'capteur9',
                hashid: '',
                gatewayid: '',
                state: 'recorded',
            },
            {
                 pubinfo: 'capteur10',
                hashid: '',
                gatewayid: '',
                state: 'recorded',
            },
        ];

        for (let i = 0; i < deviceIdentity.length; i++) {
            devicesIdentity[i].docType = 'deviceIdentity';
            await ctx.stub.putState('DEVICEIDENTITY' + i, Buffer.from(JSON.stringify(devicesIdentity[i])));
            console.info('Added <--> ', devicesIdentity[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async querySingleDeviceIdentity(ctx, deviceIdentityNumber) {
        const deviceIdentityAsBytes = await ctx.stub.getState(deviceIdentityNumber); // get the deviceIdentity from chaincode state
        if (!deviceIdentityAsBytes || deviceIdentityAsBytes.length === 0) {
            throw new Error(`${deviceIdentityNumber} does not exist`);
        }
        console.log(deviceIdentityAsBytes.toString());
        return deviceIdentityAsBytes.toString();
    }

    async createDeviceIdentity(ctx, deviceIdentityNumber, pubinfo, hashid, gatewayid, state) {
        console.info('============= START : Create DeviceIdentity ===========');

        const deviceIdentity = {
            pubinfo,
            docType: 'deviceIdentity',
            hashid,
            gatewayid,
            state,
        };

        await ctx.stub.putState(deviceIdentityNumber, Buffer.from(JSON.stringify(deviceIdentity)));
        console.info('============= END : Create DeviceIdentity ===========');
    }

    async queryAllDevicesIdentity(ctx) {
        const startKey = 'DEVICEIDENTITY0';
        const endKey = 'DEVICEIDENTITY999';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async changeDeviceIdentityState(ctx, deviceIdentityNumber, newState) {
        console.info('============= START : changeDeviceIdentityState ===========');

        const deviceIdentityAsBytes = await ctx.stub.getState(deviceIdentityNumber); // get the deviceIdentity from chaincode state
        if (!deviceIdentityAsBytes || deviceIdentityAsBytes.length === 0) {
            throw new Error(`${deviceIdentityNumber} does not exist`);
        }
        const deviceIdentity = JSON.parse(deviceIdentityAsBytes.toString());
        deviceIdentity.state = newState;

        await ctx.stub.putState(deviceIdentityNumber, Buffer.from(JSON.stringify(deviceIdentity)));
        console.info('============= END : changeDeviceIdentityState ===========');
    }

}

module.exports = FabDeviceIdentity;