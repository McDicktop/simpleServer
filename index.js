require("dotenv").config();
const http = require("http");
const url = require("url");
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
const evalidator = require("email-validator");

// const name = ["Alex", "Sam", "Pete"],
//     surname = ["Red", "White", "Black"];

const data = [];
// for (let i = 0; i < name.length; i++) {
//     data.push({
//         id: uuidv4(),
//         date: moment().format("DD-MM-YYYY"),
//         name: name[i],
//         surname: surname[i],
//         mail: surname[i] + "@gmail.com",
//     });
// }

// data.push({
//     id: "1234",
//     date: '14-05-2024',
//     name: "Zxc",
//     surname: "ZXCZXC",
//     mail: "ZXCZXC@gmail.com",
// });

const server = http.createServer((req, res) => {

    function responseEnd(codeArg, jsonArg) {
        res.writeHead(codeArg);
        res.end(JSON.stringify(jsonArg));
    }

    function processData(arrArg){
        if (arrArg.length === 0) {
            responseEnd(404, { info: "No matching entries." });
            return;
        } else if (arrArg.length === 1) {
            responseEnd(200, arrArg[0]);
            return;
        } else {
            responseEnd(200, arrArg);  
            return;          
        }
    }

    const urlParse = url.parse(req.url, true);
    const { protocol, method, pathname, query, port } = urlParse;

    if (pathname === "/") {
        responseEnd(200, { info: "Mainpage" });
        return;
    }

    if (pathname === "/api") {
        if (req.method === "GET") {

            if (Object.values(query).length === 0) {
                responseEnd(200, data);
                return;
            }
           
            let receivedData = getData(query);    

            processData(receivedData);
            return; 

        } else if (req.method === "DELETE") {

            if (Object.values(query).length === 0) {
                data.splice(0, data.length);
                responseEnd(200, { info: "All data deleted" });
                return;
            }

            let deleted = deleteData(query);
            
            processData(deleted);
            return;
          
        } else if (req.method === "POST") {
            let body = "";

            req.on("data", (chunk) => {
                body += chunk.toString();
            });

            req.on("end", () => {
                try {
                    let newItem = JSON.parse(body);

                    if (validateEntry(newItem)) {
                        newItem.id = uuidv4();
                        data.push(newItem);
                        responseEnd(200, newItem);
                    } else throw new Error();
                } catch (e) {
                    responseEnd(400, { info: "Invalid body type." });
                    return;
                }
            });
        } else {
            responseEnd(405, { info: "Method not allowed" });
            return;
        }
    } else {
        responseEnd(404, { info: "Path doesnt exists" });
    }
});

server.listen(process.env.PORT, () => {
    console.log(`server on ${process.env.PORT}`);
});







function validateDate(dateArg, format) {
    const parsedDate = moment(dateArg, format, true);
    return parsedDate.isValid();
}

function validateEmail(arg) {
    return evalidator.validate(arg);
}

function validateName(arg) {
    return typeof arg === "string" && /^[a-zA-Z]+$/.test(arg);
}

function validateEntry(arg) {
    const keys = ["date", "name", "surname", "mail"];
    Object.keys(arg).forEach((key) => {
        if (!keys.includes(key)) return false;
    });
    if (
        validateDate(arg.date, "DD-MM-YYYY") &&
        validateEmail(arg.mail) &&
        validateName(arg.name) &&
        validateName(arg.surname)
    )
        return true;
    return false;
}

function deleteData(arg) {
    if (arg.id) {
        let index = data.findIndex((el) => el.id === arg.id);
        if (index > -1) {
            return data.splice(index, 1);
        }
    }

    if (arg.date) {
        let deleted = [];
        for (let i = data.length - 1; i >= 0; i--){
            if (arg.date === data[i].date) {
                deleted.push(data.splice(i, 1)[0])                
            }
        }
        if (deleted.length > 0) {
            return deleted;
        }
    }

    return [];
}

function getData(arg) {
    if (arg.id) {
        let index = data.findIndex((el) => el.id === arg.id);
        if (index > -1) {
            return data[index];
        }
    }

    if (arg.date) {
        return data.filter(el => el.date === arg.date);
    }

    return [];
}


// 1. Валидация записи на добавлении (по всем полям). Добавление вынести в
// отдельную функцию, валидацию закинуть как утилиты

// 2. Добавить в удаление логику удаления записей по дате, если нет параметров вообще, тогда удалаются все записи

// 3. Написать логику, которая каждые 5 секунд будет создавать бекап
// Создан пустой массив, который каждые 5 секунд переписывается под актуаьные данные из data