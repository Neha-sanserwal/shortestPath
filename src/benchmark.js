const redisClient = require("redis").createClient({ db: 1 });
const http = require("http");
const getServerOption = () => {
  return {
    port: 8000,
    host: "localhost",
    method: "get",
    path: "/path/",
  };
};

paths = ["a/b", "g/a", "m/l", "j/m"];
redisClient.FLUSHALL();

let data = "";
const runRequest = function () {
  for (const path of paths) {
    options = getServerOption();
    options.path = options.path.concat(path);
    const req = http.get(options, (res, err) => {
      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        data += chunk;
      });
    });
    req.end();
  }
};

const main = function () {
  runRequest();
  console.log("hrllo");
  setTimeout(() => {
    console.log("hello", JSON.parse(data));
  }, 4000);
};
main();
redisClient.end(1);
