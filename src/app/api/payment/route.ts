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

// Extend global type for payment orders storage
declare global {
  var paymentOrders: Map<string, OrderDetails> | undefined;
  var completedOrders: Map<string, OrderDetails> | undefined;
}

// NOWPayments API configuration
const NOWPAYMENTS_API_URL = "https://api.nowpayments.io/v1";

// Get environment variables at runtime (not build time)
function getNowPaymentsConfig() {
  return {
    apiKey: process.env.NOWPAYMENTS_API_KEY,
    ipnSecret: process.env.NOWPAYMENTS_IPN_SECRET,
    walletAddress: process.env.NOWPAYMENTS_WALLET_ADDRESS,
    testMode: process.env.NOWPAYMENTS_TEST_MODE === "true",
  };
}

// Calculate order total from cart items
function calculateOrderTotal(items: any[]): number {
  // Hosting plan free domain quotas
  const HOSTING_QUOTAS: Record<string, number> = {
    "Starter Hosting": 1,
    "Professional Hosting": 3,
    "Business Hosting": 5,
  };

  const domainItems = items.filter((item) => item.type === "domain");
  const hostingItems = items.filter((item) => item.type === "hosting");

  const domainCount = domainItems.length;
  const hostingPlan = hostingItems.find((item) => item.type === "hosting");
  const freeDomainsQuota = hostingPlan
    ? HOSTING_QUOTAS[hostingPlan.name] || 0
    : 0;
  const freeDomainCount = hostingPlan
    ? Math.min(domainCount, freeDomainsQuota)
    : 0;

  const domainTotal = domainItems.reduce((sum, item) => sum + item.price, 0);
  const hostingTotal = hostingItems.reduce((sum, item) => sum + item.price, 0);
  const discount = freeDomainCount * 9.99;

  return hostingTotal + domainTotal - discount;
}

// Create a payment invoice with NOWPayments
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, user } = body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "No items in cart" },
        { status: 400 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const orderTotal = calculateOrderTotal(items);

    // Get NOWPayments config at runtime
    const nowPaymentsConfig = getNowPaymentsConfig();

    if (orderTotal <= 0) {
      // Free order - no payment needed
      return NextResponse.json({
        success: true,
        freeOrder: true,
        message: "Order is free - no payment required",
      });
    }

    // Check if NOWPayments is configured
    if (!nowPaymentsConfig.apiKey || !nowPaymentsConfig.walletAddress) {
      console.log("NOWPayments not configured, using mock payment");
      console.log("API Key:", nowPaymentsConfig.apiKey ? "set" : "missing");
      console.log("Wallet Address:", nowPaymentsConfig.walletAddress ? "set" : "missing");
      return NextResponse.json({
        success: true,
        mockPayment: true,
        orderId: `order_${Date.now()}`,
        amount: orderTotal,
        message: "Mock payment - NOWPayments not configured",
      });
    }

    // Generate order ID
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Create payment invoice with NOWPayments
    const paymentData = {
      price_amount: orderTotal,
      price_currency: "usd",
      pay_currency: "usdt",
      order_id: orderId,
      order_description: `Illusionhost - Domain and Hosting Purchase`,
      ipn_callback_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/payment/webhook`,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/cart?payment=success&orderId=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/cart?payment=cancelled`,
    };

    const response = await fetch(`${NOWPAYMENTS_API_URL}/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": nowPaymentsConfig.apiKey,
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("NOWPayments API error:", error);
      console.error("Response status:", response.status);
      console.error("Request data:", paymentData);
      return NextResponse.json(
        { error: "Failed to create payment invoice" },
        { status: 500 }
      );
    }

    const paymentResult = await response.json();

    // Store order details for webhook processing
    const orderDetails: OrderDetails = {
      orderId,
      userId: user.id,
      userEmail: user.email,
      items,
      total: orderTotal,
      paymentId: paymentResult.payment_id,
      payAddress: paymentResult.pay_address,
      payAmount: paymentResult.pay_amount,
      payCurrency: paymentResult.pay_currency,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // In a real app, you'd store this in a database
    // For now, we'll store in memory (note: this won't persist across server restarts)
    if (!global.paymentOrders) {
      global.paymentOrders = new Map<string, OrderDetails>();
    }
    global.paymentOrders.set(orderId, orderDetails);

    return NextResponse.json({
      success: true,
      paymentId: paymentResult.payment_id,
      payAddress: paymentResult.pay_address,
      payAmount: paymentResult.pay_amount,
      payCurrency: paymentResult.pay_currency,
      payUrl: paymentResult.pay_url,
      orderId,
      total: orderTotal,
    });
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get payment status
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const paymentId = searchParams.get("paymentId");

  if (!paymentId) {
    return NextResponse.json(
      { error: "Payment ID required" },
      { status: 400 }
    );
  }

  // Check if NOWPayments is configured
  const nowPaymentsConfig = getNowPaymentsConfig();

  if (!nowPaymentsConfig.apiKey) {
    return NextResponse.json({
      status: "mock",
      message: "NOWPayments not configured",
    });
  }

  try {
    const response = await fetch(
      `${NOWPAYMENTS_API_URL}/payment/${paymentId}`,
      {
        headers: {
          "x-api-key": nowPaymentsConfig.apiKey,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to get payment status" },
        { status: 500 }
      );
    }

    const paymentStatus = await response.json();
    return NextResponse.json(paymentStatus);
  } catch (error) {
    console.error("Payment status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
