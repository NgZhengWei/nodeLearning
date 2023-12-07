const fs = require("fs");

const routeHandler = (req, res) => {
    const url = req.url;
    const method = req.method;

    if (url === "/" && method === "GET") {
        res.setHeader("Content-Type", "text/html");
        res.write("<html>");
        res.write("<head><title>Home</title></head>");
        res.write("<body>");
        res.write("<form method='POST' action='/create-user'>");
        res.write(
            "<input type='text' name='username' placeholder='username'/>"
        );
        res.write("<button type='submit'>Submit</button>");
        res.write("</form>");
        res.write("</body>");
        res.write("</html>");
        return res.end();
    }
    if (url === "/users") {
        res.setHeader("Content-Type", "text/html");
        res.write("<html>");
        res.write("<head><title>Users</title></head>");
        res.write("<body>");
        res.write("<ul>");
        res.write("<li>John</li>");
        res.write("<li>Jane</li>");
        res.write("<li>Joseph</li>");
        res.write("</ul>");
        res.write("</body>");
        res.write("</html>");
        return res.end();
    }
    if (url === "/create-user" && method === "POST") {
        const body = [];
        req.on("data", (chunk) => {
            body.push(chunk);
        });
        return req.on("end", () => {
            const parsedBody = Buffer.concat(body).toString();
            const username = parsedBody.split("=")[1];
            fs.writeFile("username.txt", username, () => {
                console.log(`username saved: ${username}`);
                res.writeHead(302, "redirect", { Location: "/" });
                return res.end();
            });
        });
    }

    // default response
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>Default</title></head>");
    res.write("<body>You reached the default page!</body>");
    res.write("</html>");
    res.end();
};

module.exports = {
    handler: routeHandler,
};
