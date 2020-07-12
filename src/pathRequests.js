const getCurrentId = function (client) {
  return new Promise((resolve, reject) => {
    client.incr("curr_id", (err, res) => {
      resolve(res);
    });
  });
};

const createJob = function (redisClient, id, pathSet) {
  return new Promise((resolve, reject) => {
    const status = ["status", "scheduled"];
    const sentAt = ["sentAt", new Date()];
    const pathDetails = Object.keys(pathSet).reduce((list, key) => {
      return list.concat([key, pathSet[key]]);
    }, []);
    const jobDetails = status.concat(pathDetails, sentAt);
    redisClient.hmset(`job_${id}`, jobDetails, (err, res) => {
      resolve({ id });
    });
  });
};

const addPathRequest = function (redisClient, imageSet) {
  return getCurrentId(redisClient).then((id) => {
    return createJob(redisClient, id, imageSet);
  });
};

const completedProcessing = function (redisClient, id, path) {
  return new Promise((resolve, reject) => {
    console.log("came here", id);
    const status = ["status", "completed"];
    const completedAt = ["completedAt", new Date()];
    const pathFound = ["pathFound", JSON.stringify(path)];
    redisClient.hmset(
      `job_${id}`,
      status.concat(pathFound, completedAt),
      (err, res) => {
        if (err) {
          reject(res);
        }
        resolve(res);
      }
    );
  });
};

const get = (client, id) => {
  return new Promise((resolve, reject) => {
    client.hgetall(`job_${id}`, (err, res) => {
      resolve(res);
    });
  });
};

module.exports = { addPathRequest, completedProcessing, get };
