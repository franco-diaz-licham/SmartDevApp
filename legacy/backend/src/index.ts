import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { handleSendEmail } from "./functions/contact";

/** Register contact endpoint. */
app.http("sendEmail", {
    methods: ["POST"],
    authLevel: "anonymous",
    route: "sendEmail",
    handler: handleSendEmail,
});
