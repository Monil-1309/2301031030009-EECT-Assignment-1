import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

const UPI_ID = "monildesai580@oksbi";

export default function PaymentForm({ amount }: { amount: number }) {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    const res = await fetch("/api/payment/razorpay/create", {
      method: "POST",
      body: JSON.stringify({ amount, receipt: "order_rcptid_" + Date.now() }),
      headers: { "Content-Type": "application/json" },
    });
    const { order } = await res.json();

    const razorpay = new (window as any).Razorpay({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "ElixLifestyle",
      description: "Order Payment",
      order_id: order.id,
      handler: async function (response: any) {
        // Verify payment
        const verifyRes = await fetch("/api/payment/razorpay/verify", {
          method: "POST",
          body: JSON.stringify(response),
          headers: { "Content-Type": "application/json" },
        });
        const verifyData = await verifyRes.json();
        if (verifyData.status === "success") {
          alert("Payment Successful!");
        } else {
          alert("Payment Failed!");
        }
      },
      prefill: {
        email: "",
        contact: "",
      },
      theme: { color: "#F37254" },
      method: {
        upi: true,
        card: true,
        netbanking: true,
        wallet: true,
      },
    });
    razorpay.open();
    setLoading(false);
  };

  // UPI QR code string
  const upiString = `upi://pay?pa=${UPI_ID}&pn=ElixLifestyle&am=${amount}&cu=INR`;

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-lg font-bold mb-2">Pay Securely</h2>
      <button
        onClick={handlePay}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Processing..." : "Pay with Razorpay"}
      </button>
      <div className="mt-4">
        <h3 className="font-semibold">Or Scan UPI QR</h3>
        <QRCodeSVG value={upiString} size={180} />
        <p className="text-sm mt-2">UPI ID: {UPI_ID}</p>
      </div>
    </div>
  );
}
