import { EmailClient } from "@azure/communication-email";
import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { mapToResponse } from "../helpers";

/** Request body */
interface RequestBody {
    name: string;
    email: string;
    message: string;
}

/** Handles sending messages via communcation email service. */
export async function handleSendEmail(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    // read required info
    const ACS_CONN = process.env.COMMUNICATION_SERVICES_CONNECTION_STRING;
    const TO_ME = process.env.CONTACT_TO_EMAIL;
    const SENDER = process.env.CONTACT_SENDER_ADDRESS;

    // Validate
    if (!ACS_CONN) return mapToResponse(500, { ok: false, error: "Connection key is null." });
    if (!TO_ME) return mapToResponse(500, { ok: false, error: "To me email is null." });
    if (!SENDER) return mapToResponse(500, { ok: false, error: "Sender email is null" });

    // intantiate a new client email
    const emailClient = new EmailClient(ACS_CONN);
    context.log(`contact invoked: ${request.method} ${request.url}`);

    // get data from json
    const body = (await request.json().catch(() => {})) as RequestBody;
    let name = body.name ?? "";
    let email = body.email ?? "";
    let message = body.message ?? "";

    // Build the email message
    const subject = "SmartDev Enquiry";
    const plainText = `From: ${name}\nEmail: ${email}\n\nMessage:\n${message || "(no message)"}\n`;
    const emailMessage = {
        senderAddress: SENDER,
        recipients: { to: [{ address: TO_ME, displayName: "Me" }] },
        content: { subject, plainText },
    };

    // Send and wait for final outcome
    try {
        const poller = await emailClient.beginSend(emailMessage);
        const result = await poller.pollUntilDone();
        context.log(`Email send result: ${result?.status}`);
        return mapToResponse(200, { ok: true, status: result?.status ?? "Sent" });
    } catch (err: any) {
        return mapToResponse(502, { ok: false, error: "Email send failed" });
    }
}
