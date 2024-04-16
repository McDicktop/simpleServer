require("dotenv").config();
const http = require("http"),
    url = require("url"),
    { v4: uuidv4 } = require("uuid"),
    data = [],
    {validate, dataHandler} = require('./utils');

let backup;

setInterval(() => (backup = [...data]), 10000);


const server = http.createServer((req, res) => {
    function responseEnd(codeArg, jsonArg) {
        res.writeHead(codeArg);
        res.end(JSON.stringify(jsonArg));
    }

    function processData(arrArg) {
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
    const { pathname, query } = urlParse;

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
            let receivedData = dataHandler.get(query, data);
            processData(receivedData);
            return;
        } else if (req.method === "DELETE") {
            if (Object.values(query).length === 0) {
                data.splice(0, data.length);
                responseEnd(200, { info: "All data deleted" });
                return;
            }
            let deleted = dataHandler.delete(query, data);
            processData(deleted);
            return;
        } else if (req.method === "POST") {
            let body = "";
            req.on("data", (chunk) => (body += chunk.toString()));
            req.on("end", () => {
                try {
                    let newItem = JSON.parse(body);
                    if (validate.entry(newItem)) {
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
    } else responseEnd(404, { info: "Path doesnt exists" });
});

server.listen(process.env.PORT, () => {
    console.log(`server on ${process.env.PORT}`);
});


// 1. Валидация записи на добавлении (по всем полям). Добавление вынести в
// отдельную функцию, валидацию закинуть как утилиты

// 2. Добавить в удаление логику удаления записей по дате, если нет параметров вообще, тогда удалаются все записи

// 3. Написать логику, которая каждые 5 секунд будет создавать бекап
// Создан пустой массив, который каждые 5 секунд переписывается под актуаьные данные из data

// Выборка и фильтрация в MondoDB