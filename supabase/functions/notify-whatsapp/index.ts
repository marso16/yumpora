import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const payload = await req.json();
  console.log("Webhook payload:", JSON.stringify(payload));

  const order = payload.record;
  console.log("Order:", JSON.stringify(order));

  const phone = Deno.env.get("MY_PHONE");
  const apiKey = Deno.env.get("CALLMEBOT_API_KEY");

  const total = parseFloat(order.total_amount || 0).toFixed(2)

  const message = `
🛍️ *NEW ORDER* | 🆔 ${order.id?.slice(0, 8).toUpperCase()}
━━━━━━━━━━━━━━
👤 ${order.customer_name} | 📞 ${order.customer_phone}
📍 ${order.delivery_address}, ${order.city}
💳 ${order.payment_method} | 💰 *$${total}*
📝 ${order.notes || "No notes"}
━━━━━━━━━━━━━━
🚀 Please process this order.
  `.trim();

  const encodedMessage = encodeURIComponent(message);

  const res = await fetch(
    `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodedMessage}&apikey=${apiKey}`
  );

  console.log("CallMeBot response:", res.status);

  return new Response("ok");
});