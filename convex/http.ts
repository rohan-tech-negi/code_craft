import { httpRouter } from "convex/server";

import {httpAction} from "./_generated/server";

const http = httpRouter();


http.route({
    path: "/clerk-webhook",
    method: "POST",
    handler: httpAction(async(ctx, req)) => {
       const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

       if(!webhookSecret) {
           throw new Error("CLERK_WEBHOOK_SECRET is not defined");
       }

        const svix_id = request.headers.get("svix-id");
    const svix_signature = request.headers.get("svix-signature");
    const svix_timestamp = request.headers.get("svix-timestamp");

      if (!svix_id || !svix_signature || !svix_timestamp) {
      return new Response("Error occurred -- no svix headers", {
        status: 400,
      });
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(webhookSecret);
    let evt: WebhookEvent;
    }
})