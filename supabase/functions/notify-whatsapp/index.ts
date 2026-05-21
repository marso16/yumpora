import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const payload = await req.json();
  const order = payload.record;

  const phone = Deno.env.get("MY_PHONE");
  const apiKey = Deno.env.get("CALLMEBOT_API_KEY");

  const message = `
🛍️ *NEW ORDER* | 🆔 ${order.id}
━━━━━━━━━━━━━━
👤 ${order.customer_name} | 📞 ${order.customer_phone}
📍 ${order.delivery_address}, ${order.city}
💳 ${order.payment_method} | 💰 *$${order.total_amount}*
📝 ${order.notes || "No notes"}
━━━━━━━━━━━━━━
🚀 Please process this order.
  `.trim();

  const encodedMessage = encodeURIComponent(message);

  await fetch(
    `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodedMessage}&apikey=${apiKey}`
  );

  return new Response("ok");
});