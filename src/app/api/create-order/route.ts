import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json();
    console.log("📦 Backend: Received order request for amount:", amount);

    const amountInPaise = Math.round(Number(amount) * 100);

    if (!amountInPaise || amountInPaise < 100) {
      console.error("❌ Backend: Invalid amount (too small)");
      return NextResponse.json({ error: 'Minimum amount is ₹1 (100 paise)' }, { status: 400 });
    }

    const key_id = process.env.RAZORPAY_KEY_ID?.trim();
    const key_secret = process.env.RAZORPAY_KEY_SECRET?.trim();

    if (!key_id || !key_secret) {
      console.error("❌ Backend: Missing Razorpay keys in environment variables");
      return NextResponse.json({ 
        error: 'Razorpay authentication failed: Keys missing.',
      }, { status: 401 });
    }

    console.log("🔑 Backend: Initializing Razorpay with Key ID:", key_id);

    const razorpay = new Razorpay({
      key_id: key_id,
      key_secret: key_secret,
    });

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
    };

    console.log("📡 Backend: Creating order with options:", options);
    const order = await razorpay.orders.create(options);
    console.log("✅ Backend: Order created successfully:", order.id);

    return NextResponse.json(order);
  } catch (error: any) {
    console.error('❌ Backend: Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
