// match and increment api requests based on username
const apiStatUserModel = require("../database/apiStatUserModel");
const topUserEndpointModel = require("../database/topUserEndpointSchema");
const routeAccessLogModel = require("../database/routeAccessLogSchema");

const logUniqueAPIUsers = async (username) => {
    try {
        const match = await apiStatUserModel.findOne({
            date: new Date().toISOString().substring(0, 10)
        })
        if (match) {
            let counted = false;
            match.stats.forEach((u, index) => {
                if (u.user == username) {
                    match.stats[index].apiAccessCount += 1;
                    counted = true;
                }
            });
            if (!counted) {
                match.stats.push({
                    user: username
                });
            }
            match.save();
        } else {
            await apiUserStaModel.create({
                stats: [
                    {
                        user: username,
                    }
                ]
            })
        }
    } catch (err) {
        console.log(err);
    }
}


const logTopUserByEndpoint = async (endpoint, username) => {
    try {
        const match = await topUserEndpointModel.findOne({
            endpoint: endpoint
        })
        if (match) {
            let counted = false;
            match.access.forEach((u, index) => {
                if (u.user == username) {
                    match.access[index].count += 1;
                    counted = true;
                }
            });
            if (!counted) {
                match.access.push({
                    user: username
                });
            }
            match.save();
        } else {
            await topUserEndpointModel.create({
                endpoint: endpoint,
                access: [
                    {
                        user: username
                    }
                ]
            })
        }
    } catch (err) {
        console.log(err);
    }
}

const logRouteAccess = async (endpoint, status, method) => {
    try {
        await routeAccessLogModel.create({
            endpoint: endpoint,
            status: status,
            method: method
        })
    } catch (err) {
        console.log(err);
    }
}

module.exports = { logUniqueAPIUsers, logTopUserByEndpoint, logRouteAccess }