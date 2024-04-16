function deleteData(arg, data) {
    if (arg.id) {
        let index = data.findIndex((el) => el.id === arg.id);
        if (index > -1) return data.splice(index, 1);
    }
    if (arg.date) {
        const deleted = [];
        for (let i = data.length - 1; i >= 0; i--) {
            if (arg.date === data[i].date) deleted.push(data.splice(i, 1)[0]);
        }
        if (deleted.length > 0) return deleted;
    }
    return [];
}

function getData(arg, data) {
    if (arg.id) {
        let index = data.findIndex((el) => el.id === arg.id);
        if (index > -1) return data[index];
    }
    if (arg.date) return data.filter((el) => el.date === arg.date);
    return [];
}

module.exports = {
    deleteData,
    getData
}