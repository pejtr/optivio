import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Menu, X, LogOut, Package, Users, BarChart3 } from "lucide-react";
import { useLocation } from "wouter";
import AdminNichePackages from "./AdminNichePackages";
import AdminSubscriptions from "./AdminSubscriptions";
import AdminStats from "./AdminStats";

export default function AdminDashboard() {
  const { user, logout, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Redirect if not authenticated or not admin
  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Přístup zamítnut</CardTitle>
            <CardDescription>Pouze administrátoři mají přístup k admin panelu.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/")} className="w-full">
              Zpět na domovskou stránku
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              O
            </div>
            <h1 className="text-2xl font-bold text-slate-900">OPTIVIO Admin</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <span className="text-sm text-slate-600">
              Přihlášen jako: <strong>{user?.name}</strong>
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                logout();
                setLocation("/");
              }}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Odhlásit se
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-3">
            <div className="text-sm text-slate-600 pb-3 border-b">
              Přihlášen jako: <strong>{user?.name}</strong>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                logout();
                setLocation("/");
              }}
              className="w-full flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Odhlásit se
            </Button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-3 mb-8">
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 hidden sm:inline" />
              <span className="hidden sm:inline">Přehled</span>
              <span className="sm:hidden">Přehled</span>
            </TabsTrigger>
            <TabsTrigger value="packages" className="flex items-center gap-2">
              <Package className="w-4 h-4 hidden sm:inline" />
              <span className="hidden sm:inline">Balíčky</span>
              <span className="sm:hidden">Balíčky</span>
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="flex items-center gap-2">
              <Users className="w-4 h-4 hidden sm:inline" />
              <span className="hidden sm:inline">Předplatná</span>
              <span className="sm:hidden">Předplatná</span>
            </TabsTrigger>
          </TabsList>

          {/* Stats Tab */}
          <TabsContent value="stats">
            <AdminStats />
          </TabsContent>

          {/* Packages Tab */}
          <TabsContent value="packages">
            <AdminNichePackages />
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions">
            <AdminSubscriptions />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
