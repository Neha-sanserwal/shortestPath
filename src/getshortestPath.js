const PAIRS = require("./path.json");
const createGraphList = function (data) {
  let list = {};
  for (const [source, destination] of data) {
    if (!list[source]) {
      list[source] = [];
    }
    if (!list[source].includes(destination)) {
      list[source].push(destination);
    }
  }
  return list;
};
const isNewPathSmall = function (newPathLength, previousPathLength) {
  return (
    newPathLength - 1 &&
    (newPathLength < previousPathLength || !previousPathLength)
  );
};
const findShortestPath = function (links, source, target, visitedNodes) {
  let possiblePaths = [];
  visitedNodes.push(source);
  if (!links[source]) {
    return possiblePaths;
  }

  if (links[source].includes(target)) {
    visitedNodes.push(target);
    possiblePaths.push(source, target);
  }
  for (const newSource of links[source]) {
    if (!visitedNodes.includes(newSource)) {
      let newPath = findShortestPath(links, newSource, target, visitedNodes);
      newPath.unshift(source);
      if (isNewPathSmall(newPath.length, possiblePaths.length)) {
        possiblePaths = newPath.slice();
        let idx = visitedNodes.indexOf(newSource);
        visitedNodes.splice(idx);
      }
    }
  }

  return possiblePaths;
};

const processPaths = function (source, target) {
  let visitedNodes = [];
  let path = [];
  let links = createGraphList(PAIRS);
  path = findShortestPath(links, source, target, visitedNodes);
  return path;
};

module.exports = { processPaths };
