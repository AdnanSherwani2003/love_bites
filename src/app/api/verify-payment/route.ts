import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    console.log("[VERIFY-API] Request received for order:", razorpay_order_id);

    const secret = process.env.RAZORPAY_SECRET?.trim();
    if (!secret) {
      return NextResponse.json({ error: 'Razorpay secret missing' }, { status: 500 });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      console.log("[VERIFY-API] Signature verification PASSED");
      // Initialize Razorpay to capture the payment
      const key_id = process.env.RAZORPAY_KEY_ID?.trim();
      if (!key_id) throw new Error('Razorpay key id missing');
      
      const Razorpay = require('razorpay');
      const rzp = new Razorpay({ key_id, key_secret: secret });
      
      // Capture the payment (amount must be fetched from order)
      try {
        const order = await rzp.orders.fetch(razorpay_order_id);
        await rzp.payments.capture(razorpay_payment_id, order.amount, 'INR');
        console.log("[VERIFY-API] Capture SUCCEEDED");
      } catch (captureError: any) {
        // If the payment is already captured (e.g. auto-capture enabled in dashboard), ignore the error
        if (captureError?.error?.description?.includes('already been captured') || captureError?.error?.code === 'BAD_REQUEST_ERROR') {
          console.log('[VERIFY-API] Payment was already captured (auto-capture)');
        } else {
          console.error("[VERIFY-API] Capture FAILED:", captureError);
          throw captureError;
        }
      }

      console.log("[VERIFY-API] Returning SUCCESS response");
      return NextResponse.json({ success: true, message: 'Payment verified and captured successfully' });
    } else {
      console.error("[VERIFY-API] Signature verification FAILED");
      return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('[VERIFY-API] Error verifying payment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
