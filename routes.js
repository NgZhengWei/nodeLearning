const fs = require("fs");

const requestHandler = (req, res) => {
    // req and res are node objects representing the req and res obtained
    const url = req.url;
    const method = req.method;
    if (url === "/") {
        res.setHeader("Content-Type", "text/html");
        res.write("<html>");
        res.write("<head><title>Enter message</title></head>");
        res.write(
            "<body><form action='/message' method='POST'><input name='message' type='text'/><button type='submit'>Submit</button></form></body>"
        );
        res.write("</html>");
        return res.end();
    }
    if (url === "/message" && method === "POST") {
        const body = [];
        // adds event listener for incoming data and calls this callback fn when it happens
        req.on("data", (chunk) => {
            // chunk is a Buffer obj
            body.push(chunk);
        });
        // need to return here to prevent below code from exec
        return req.on("end", () => {
            // consolidates all Buffer obj in array
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split("=")[1];
            // async write to file. cb fn exec after writing is done. If no errors, input is null
            fs.writeFile("message.txt", message, (error) => {
                res.writeHead(302, "Redirecting", { Location: "/" });
                return res.end();
            });
        });
    }

    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>node page</title></head>");
    res.write("<body>Hello world</body>");
    res.write("</html>");
    res.end();
};

// ----- Different ways of exporting -----

// module.exports = {
//     handler: requestHandler,
//     text: "hard coded text",
// };

// module.exports.handler = requestHandler;
// module.exports.text = "hard coded text";

exports.handler = requestHandler;
exports.text = "hard coded text";
