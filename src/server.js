const express = require("express");
const app = express();
const http = require("http");

const pathRequests = require("./pathRequests");
const redisClient = require("redis").createClient({ db: 1 });
const getServerOption = () => {
  return {
    port: 8000,
    host: "localhost",
    method: "get",
    path: "/status",
  };
};
app.use((req, res, next) => {
  console.log("request made was :", req.url, req.method);
  next();
});

app.get("/status/:id", (req, res) => {
  pathRequests.get(redisClient, req.params.id).then((imageSet) => {
    res.write(JSON.stringify(imageSet));
    res.end();
  });
});
const getUpdate = function (id) {
  return new Promise((resolve, reject) => {
    let options = getServerOption();
    options.path = options.path.concat(`/${id}`);
    req = http.get(options, (res, err) => {
      if (err) {
        reject(error.message);
      }
      res.setEncoding("utf8");
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        resolve(data);
      });
    });
    req.end();
  });
};
app.get("/path/:from/:to", (req, res) => {
  pathRequests.addPathRequest(redisClient, req.params).then((job) => {
    redisClient.lpush("ipQueue", job.id);
    getUpdate(job.id).then((data) => {
      res.end(JSON.stringify(data));
    });
  });
});

app.listen(8000, () => {
  console.log(`listen on 8000`);
});
