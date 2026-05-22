import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    const payload = await req.json();
    const order = payload.record;

    const phone = Deno.env.get("MY_PHONE");
    const apiKey = Deno.env.get("CALLMEBOT_API_KEY");

    const totalStr = Number(String(order.total_amount ?? "0")).toFixed(2);
    const shortId = (order.id ?? "").slice(0, 8).toUpperCase();
    const hasDiscount = Number(order.discount_amount ?? 0) > 0;
    const discountStr = Number(String(order.discount_amount ?? "0")).toFixed(2);

    const message = [
      `NEW ORDER #${shortId}`,
      `👤 ${order.customer_name} | ${order.customer_phone}`,
      `📍 ${order.delivery_address}, ${order.city}`,
      `📝 ${order.notes || "No notes"}`,
      hasDiscount ? `Discount: -$${discountStr}` : null,
      `TOTAL: $${totalStr} | Cash on Delivery`,
    ]
      .filter(Boolean)
      .join("\n");


    const encodedMessage = encodeURIComponent(message);
    const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodedMessage}&apikey=${apiKey}`;

    const res = await fetch(url);
    const resText = await res.text();

    return new Response("ok", { status: 200 });
  } catch (err) {
    console.error("Error:", err);
    return new Response("error", { status: 500 });
  }
});