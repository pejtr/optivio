import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Clock, AlertCircle, Download, ExternalLink } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

export default function ClientDashboard() {
  const { user } = useAuth();
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  // Fetch user's orders
  const { data: orders, isLoading: ordersLoading } = trpc.orders.listByUser.useQuery();
  const { data: payments } = trpc.payments.listByUser.useQuery();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">Přihlaste se pro zobrazení vašeho dashboardu</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
      pending: { label: "Čekající", color: "bg-yellow-100 text-yellow-800", icon: <Clock className="w-4 h-4" /> },
      deposit_paid: { label: "Záloha zaplacena", color: "bg-blue-100 text-blue-800", icon: <CheckCircle className="w-4 h-4" /> },
      completed: { label: "Hotovo", color: "bg-green-100 text-green-800", icon: <CheckCircle className="w-4 h-4" /> },
      cancelled: { label: "Zrušeno", color: "bg-red-100 text-red-800", icon: <AlertCircle className="w-4 h-4" /> },
    };
    const config = statusMap[status] || statusMap.pending;
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const formatPrice = (price: number) => `${(price / 100).toFixed(0)} Kč`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Můj Dashboard</h1>
          <p className="text-slate-600">Sledujte stav vašich projektů a plateb</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="projects">Moje projekty</TabsTrigger>
            <TabsTrigger value="payments">Platby</TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4">
            {ordersLoading ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-slate-600">Načítám vaše projekty...</p>
                </CardContent>
              </Card>
            ) : orders && orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{order.packageType}</CardTitle>
                          <CardDescription>Objednávka #{order.id}</CardDescription>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Price Info */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-slate-600">Cena balíčku</p>
                          <p className="text-lg font-bold text-slate-900">{formatPrice(order.totalPrice)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">Záloha ({order.depositPercentage}%)</p>
                          <p className="text-lg font-bold text-blue-600">{formatPrice(order.depositAmount)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">Zbývá zaplatit</p>
                          <p className="text-lg font-bold text-slate-900">{formatPrice(order.remainingAmount)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">Vytvořeno</p>
                          <p className="text-sm text-slate-900">{new Date(order.createdAt).toLocaleDateString("cs-CZ")}</p>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="border-t pt-4">
                        <p className="text-sm font-semibold text-slate-900 mb-3">Postup projektu</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-sm text-slate-700">Objednávka přijata</span>
                          </div>
                          {order.status !== "pending" && (
                            <div className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <span className="text-sm text-slate-700">Záloha zaplacena</span>
                            </div>
                          )}
                          {order.status === "completed" && (
                            <div className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <span className="text-sm text-slate-700">Projekt hotový</span>
                            </div>
                          )}
                          {order.status === "pending" && (
                            <div className="flex items-center gap-3">
                              <Clock className="w-5 h-5 text-yellow-600" />
                              <span className="text-sm text-slate-700">Čekání na zaplacení zálohy</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {order.status === "pending" && (
                        <div className="flex gap-2 pt-4">
                          <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                            Zaplatit zálohu
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-slate-600 mb-4">Nemáte žádné projekty</p>
                  <Button variant="outline">Objednat web</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-4">
            {payments && payments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Datum</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Typ</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Částka</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Stav</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Akce</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 text-sm text-slate-700">
                          {new Date(payment.createdAt).toLocaleDateString("cs-CZ")}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-700">
                          {payment.type === "deposit" ? "Záloha" : payment.type === "final" ? "Finální platba" : "Vrácení"}
                        </td>
                        <td className="py-3 px-4 text-sm font-semibold text-slate-900">
                          {formatPrice(payment.amount)}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {payment.status === "succeeded" && <Badge className="bg-green-100 text-green-800">Zaplaceno</Badge>}
                          {payment.status === "pending" && <Badge className="bg-yellow-100 text-yellow-800">Čekající</Badge>}
                          {payment.status === "failed" && <Badge className="bg-red-100 text-red-800">Selhalo</Badge>}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {payment.invoiceUrl && (
                            <Button variant="ghost" size="sm" className="gap-1">
                              <Download className="w-4 h-4" />
                              Fakturu
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-slate-600">Žádné platby</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
