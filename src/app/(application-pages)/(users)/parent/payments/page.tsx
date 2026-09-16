"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { IconLoader2, IconCreditCard, IconReceipt } from "@tabler/icons-react";
import { toast } from "sonner";
import { Badge } from "@/src/components/ui/badge"
interface Payment {
  id: string;
  amount: string;
  currency: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  createdAt: string;
  tutor?: {
    user: {
      fullname: string;
    };
  };
}

import { usePageTitle } from "@/src/hooks/usePageTitle";

export default function ParentPaymentsPage() {
  usePageTitle("My Payments");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get("/api/parent/payments");
      setPayments(response.data);
    } catch (error) {
      toast.error("Failed to fetch payments");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payments</h1>
        <p className="text-muted-foreground">Payment history and invoices</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <IconLoader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : payments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <IconCreditCard className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No payments found</p>
            <p className="text-muted-foreground">Your payment history will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {payments.map((payment) => (
            <Card key={payment.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="bg-secondary p-2 rounded-full">
                    <IconReceipt className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {payment.currency} {payment.amount}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant={payment.status === "COMPLETED" ? "default" : payment.status === "FAILED" ? "destructive" : "secondary"}>
                    {payment.status}
                  </Badge>
                  {payment.tutor && (
                    <span className="text-xs text-muted-foreground">
                      To: {payment.tutor.user.fullname}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
