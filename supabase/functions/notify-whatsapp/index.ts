import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const payload = await req.json();
  const order = payload.record;

  const phone = Deno.env.get("MY_PHONE");
  const apiKey = Deno.env.get("CALLMEBOT_API_KEY");

  const message = `
🛍️ *NEW ORDER RECEIVED*

━━━━━━━━━━━━━━
🆔 *Order ID:*
${order.id}

👤 *Customer:*
${order.customer_name}

📞 *Phone:*
${order.customer_phone}

📍 *Address:*
${order.delivery_address}, ${order.city}

💳 *Payment:*
${order.payment_method}

💰 *Total:*
$${order.total_amount}

📝 *Notes:*
${order.notes || "No notes"}

━━━━━━━━━━━━━━
🚀 Please process this order.
  `.trim();

  const encodedMessage = encodeURIComponent(message);

  await fetch(
    `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodedMessage}&apikey=${apiKey}`
  );

  return new Response("ok");
});