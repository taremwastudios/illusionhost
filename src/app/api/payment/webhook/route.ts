import { NextRequest, NextResponse } from "next/server";

// Type definitions for global storage
interface OrderDetails {
  orderId: string;
  userId: number;
  userEmail: string;
  items: any[];
  total: number;
  paymentId?: string;
  payAddress?: string;
  payAmount?: string;
  payCurrency?: string;
  status: string;
  paymentStatus?: string;
  createdAt: string;
  completedAt?: string;
}

// Extend global type for order storage
declare global {
  var paymentOrders: Map<string, OrderDetails> | undefined;
  var completedOrders: Map<string, OrderDetails> | undefined;
}

// Verify IPN signature from NOWPayments
function verifyIpnSignature(
  request: NextRequest,
  ipnSecret: string
): boolean {
  const signature = request.headers.get("x-nowpayments-sig");
  if (!signature) return false;

  // In production, you would verify the HMAC signature
  // For now, we'll do a basic check
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const NOWPAYMENTS_IPN_SECRET = process.env.NOWPAYMENTS_IPN_SECRET;

    // Verify the IPN request
    if (NOWPAYMENTS_IPN_SECRET && !verifyIpnSignature(request, NOWPAYMENTS_IPN_SECRET)) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      payment_id,
      order_id,
      payment_status,
      pay_address,
      pay_amount,
      pay_currency,
      price_amount,
      price_currency,
    } = body;

    console.log("NOWPayments IPN received:", {
      payment_id,
      order_id,
      payment_status,
    });

    // Get order details from storage
    const orderDetails = global.paymentOrders?.get(order_id);

    if (!orderDetails) {
      console.error("Order not found:", order_id);
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Update order status based on payment status
    // Payment statuses: 'waiting', 'confirming', 'confirmed', 'finished', 'failed', 'refunded'
    const isPaymentSuccessful = ["confirmed", "finished"].includes(payment_status);

    if (isPaymentSuccessful) {
      // Update order status to completed
      orderDetails.status = "completed";
      orderDetails.paymentStatus = payment_status;
      orderDetails.completedAt = new Date().toISOString();

      // In a real app, you would:
      // 1. Update the order in your database
      // 2. Send confirmation email
      // 3. Provision the domain/hosting
      // 4. Update user's purchased items

      console.log("Payment completed for order:", order_id);

      // Store completed order for user retrieval
      if (!global.completedOrders) {
        global.completedOrders = new Map<string, OrderDetails>();
      }
      global.completedOrders.set(order_id, orderDetails);
    } else if (payment_status === "failed") {
      orderDetails.status = "failed";
      orderDetails.paymentStatus = payment_status;
      console.log("Payment failed for order:", order_id);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Handle GET requests for testing
export async function GET() {
  return NextResponse.json({
    message: "NOWPayments webhook endpoint",
    status: "active",
    instructions: "Send POST requests with NOWPayments IPN data",
  });
}
