const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;

const port = 8080;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  const queryStringObject = parsedUrl.query;
  const method = req.method;
  const headers = req.headers;
  const decoder = new StringDecoder("utf-8");

  let buffer = "";

  req.on("data", data => {
    buffer += decoder.write(data);
  });

  req.on("end", () => {
    buffer += decoder.end();

    const choosenHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;

    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: buffer
    };

    choosenHandler(data, (statusCode, payload) => {
      statusCode = typeof statusCode === "number" ? statusCode : 200;

      payload = typeof payload === "object" ? payload : {};

      const payloadString = JSON.stringify(payload);

      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);
      console.log(statusCode, payloadString);
    });
  });
});

server.listen(port, err => {
  console.log(`Server is listening on port: ${port}`);
});

const handlers = {
  sample(data, callback) {
    callback(406, { name: "sample handler" });
  },
  notFound(data, callback) {
    callback(404);
  }
};

const router = {
  sample: handlers.sample
};
