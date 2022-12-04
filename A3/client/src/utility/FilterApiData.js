const FilterApiData = ({ data }) => {
    const uniqueApiUsers = [];
    const topApiUsers = [];
    const topUserEachEndpoint = [];
    const errorsByEndpoint = [];
    const recentErrors = [];

    // console.log(data.userApiData)
    // console.log(data.userEndpointData)
    // console.log(data.accessRouteLogs)

    data.userApiData.forEach(element => {
        const filteredData = {
            date: element.date,
            uniqueApiUsers: element.stats.length
        }
        uniqueApiUsers.push(filteredData);
    });

    data.userApiData.forEach(element => {
        var topApiCount = 0;
        var topUser = null;
        element.stats.forEach(e => {
            if (e.apiAccessCount > topApiCount) {
                topApiCount = e.apiAccessCount;
                topUser = e.user;
            }
        })
        const filteredData = {
            date: element.date,
            user: topUser,
            apiCount: topApiCount
        }
        topApiUsers.push(filteredData);
    });

    data.userEndpointData.forEach(element => {
        var endpoint = element.endpoint;
        var user = null;
        var count = 0;
        element.access.forEach(e => {
            if (e.count > count) {
                user = e.user;
                count = e.count;
            }
        })
        const filteredData = {
            endpoint: endpoint,
            user: user,
            count: count
        }
        topUserEachEndpoint.push(filteredData);
    })

    data.accessRouteLogs.forEach(element => {
        const firstDigitString = String(element.status)[0];
        const firstDigitNum = Number(firstDigitString);
        if (firstDigitNum === 4) {
            const filteredData = {
                endpoint: element.endpoint,
                method: element.method,
                status: element.status
            }
            errorsByEndpoint.push(filteredData);
        }
    })

    data.accessRouteLogs.forEach(element => {
        const firstDigitString = String(element.status)[0];
        const firstDigitNum = Number(firstDigitString);
        if (firstDigitNum === 4 || firstDigitNum === 5) {
            const filteredData = {
                date: element.date,
                method: element.method,
                status: element.status
            }
            recentErrors.push(filteredData);
        }
    })
    recentErrors.sort(function (a, b) {
        return new Date(b.data) - new Date(a.date);
    });

    return { uniqueApiUsers, topApiUsers, topUserEachEndpoint, errorsByEndpoint, recentErrors }
}

export default FilterApiData
