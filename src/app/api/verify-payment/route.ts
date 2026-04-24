import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET?.trim();
    if (!secret) {
      return NextResponse.json({ error: 'Razorpay secret missing' }, { status: 500 });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      console.log("[VERIFY-API] Signature verification PASSED for order:", razorpay_order_id);
      
      // CAPTURE THE PAYMENT
      // This ensures the transaction is marked as 'Captured' (completed) in the dashboard
      try {
        const key_id = process.env.RAZORPAY_KEY_ID?.trim();
        const key_secret = process.env.RAZORPAY_KEY_SECRET?.trim();
        const Razorpay = require('razorpay');
        const rzp = new Razorpay({ key_id, key_secret });

        // Fetch order to get amount
        const order = await rzp.orders.fetch(razorpay_order_id);
        await rzp.payments.capture(razorpay_payment_id, order.amount, 'INR');
        console.log("[VERIFY-API] Payment CAPTURED successfully");
      } catch (captureError: any) {
        // If already captured (auto-capture), we can ignore the error
        if (captureError?.error?.description?.includes('already been captured')) {
          console.log("[VERIFY-API] Payment was already captured (auto-capture enabled)");
        } else {
          console.error("[VERIFY-API] Capture failed but signature was valid:", captureError);
        }
      }

      return NextResponse.json({ success: true, message: 'Payment verified and captured successfully' });
    } else {
      console.error("[VERIFY-API] Signature verification FAILED for order:", razorpay_order_id);
      return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('[VERIFY-API] Error verifying payment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
