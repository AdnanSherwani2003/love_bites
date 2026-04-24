import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json();

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }

    const key_id = process.env.RAZORPAY_KEY_ID?.trim();
    const key_secret = process.env.RAZORPAY_SECRET?.trim();

    if (!key_id || !key_secret || key_secret.includes('*')) {
      return NextResponse.json({ 
        error: 'Razorpay authentication failed: Invalid or placeholder secret detected.',
        details: 'The RAZORPAY_SECRET in .env.local appears to be a masked placeholder (asterisks). Please replace it with your actual secret from the Razorpay dashboard.'
      }, { status: 401 });
    }

    const razorpay = new Razorpay({
      key_id: key_id,
      key_secret: key_secret,
    });

    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json(order);
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order', details: error },
      { status: 500 }
    );
  }
}
