import http from "node:http";
import { Signale } from "./Signale";

export class HealthcheckServer {
    private static lastRawEventTime = Date.now();
    private static healthThreshold = 3 * 60 * 1000; // 3 minutes
    private static server: http.Server;

    constructor() {
        Signale.start({ prefix: "startup", message: "HealthcheckServer starting" });

        HealthcheckServer.server = http
            .createServer((req, res) => {
                if (Date.now() - HealthcheckServer.lastRawEventTime < HealthcheckServer.healthThreshold) {
                    res.writeHead(200, { "Content-Type": "text/plain" });
                    res.end("OK");
                } else {
                    res.writeHead(500, { "Content-Type": "text/plain" });
                    res.end("Unhealthy");
                }
            })
            .listen(8080);
    }

    public static updateLastEventTime(): void {
        HealthcheckServer.lastRawEventTime = Date.now();
    }
}
