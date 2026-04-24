import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    // Ideally, use a dedicated RAZORPAY_WEBHOOK_SECRET set in your dashboard.
    // Falling back to RAZORPAY_SECRET if webhook secret is not explicitly set in env.
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_SECRET;

    if (!secret) {
      return NextResponse.json({ error: 'Webhook secret missing' }, { status: 500 });
    }

    if (!signature) {
      return NextResponse.json({ error: 'Missing Razorpay signature' }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error("Webhook signature mismatch", { expected: expectedSignature, received: signature });
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Parse the validated payload
    const payload = JSON.parse(rawBody);
    console.log(`[Webhook] Received verified event: ${payload.event}`);

    if (payload.event === 'payment.captured') {
      const paymentEntity = payload.payload.payment.entity;
      const orderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;
      
      console.log(`[Webhook] Payment ${paymentId} captured successfully for Order ${orderId}`);
      
      // Here you would typically update your database to mark the order as paid
      // e.g., await markOrderAsPaidInDatabase(orderId);
      
    } else if (payload.event === 'payment.failed') {
      console.log(`[Webhook] Payment failed:`, payload.payload.payment.entity.id);
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error: any) {
    console.error('[Webhook] Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
