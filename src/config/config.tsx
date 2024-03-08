export const ip = process.env.REACT_APP_IP
  ? process.env.REACT_APP_IP
  : "localhost";
export const port = process.env.REACT_APP_PORT
  ? process.env.REACT_APP_PORT
  : "3001";
export function getApiEndpoint(endpoint: string, method: string) {
  if (process.env.REACT_APP_DEVELOPMENT === "false") {
    return `https://${ip}/endpoint.php?endpoint=${endpoint}`;
  } else {
    return `http://${ip}:${port}/${endpoint}`;
  }
}
