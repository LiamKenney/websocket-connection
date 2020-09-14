const url = "localhost:8080";

function getDataStream() {
    let ws = new WebSocket(`ws:${url}`);
    return ws;
}

function getUrl() {
    return url;
}

export { getDataStream, getUrl };
