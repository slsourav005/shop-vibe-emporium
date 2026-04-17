import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Package, Truck, RefreshCw, CheckCircle2, Clock, MapPin, User, Phone, Inbox } from "lucide-react";
import Navbar from "@/components/Navbar";
import SellerChat from "@/components/SellerChat";
import { loadOrders, updateOrderStatus, type LocalOrder } from "@/lib/orders";

const STATUSES = ["PLACED", "PACKED", "SHIPPED", "DELIVERED"];

const Admin = () => {
  const [tab, setTab] = useState<"logistics" | "sell">("logistics");
  const [orders, setOrders] = useState<LocalOrder[]>([]);

  const refresh = () => setOrders(loadOrders());

  useEffect(() => {
    refresh();
    const onChange = () => refresh();
    window.addEventListener("vv:orders-changed", onChange);
    window.addEventListener("storage", onChange);
    const t = setInterval(refresh, 5000);
    return () => {
      window.removeEventListener("vv:orders-changed", onChange);
      window.removeEventListener("storage", onChange);
      clearInterval(t);
    };
  }, []);

  const handleStatus = (id: string, status: string) => {
    updateOrderStatus(id, status);
    refresh();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={() => {}} />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to marketplace
          </Link>
          <button
            onClick={refresh}
            className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
        </div>

        <div className="mt-6 mb-6">
          <h1 className="text-2xl font-bold text-foreground">Admin Console</h1>
          <p className="text-sm text-muted-foreground">Logistics dashboard & seller assistant</p>
        </div>

        <div className="mb-6 inline-flex rounded-full border border-border bg-muted/40 p-1">
          <button
            onClick={() => setTab("logistics")}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              tab === "logistics"
                ? "bg-primary text-primary-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Truck className="h-4 w-4" /> Logistics
            {orders.length > 0 && (
              <span className="ml-1 rounded-full bg-background/20 px-1.5 text-[10px]">
                {orders.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab("sell")}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              tab === "sell"
                ? "bg-primary text-primary-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Package className="h-4 w-4" /> Seller Chat
          </button>
        </div>

        {tab === "logistics" && (
          <div className="space-y-3">
            {orders.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center">
                <Inbox className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-3 text-sm text-muted-foreground">No orders yet.</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Orders placed in this browser will appear here for logistics tracking.
                </p>
              </div>
            )}
            {orders.map((o) => (
              <div
                key={o._id}
                className="rounded-2xl border border-border bg-card p-4 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        #{o._id.slice(-6)}
                      </span>
                      <StatusBadge status={o.status} />
                      <span className="text-xs text-muted-foreground">
                        {new Date(o.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <p className="mt-2 text-sm font-semibold text-foreground capitalize">
                      {o.productName}{" "}
                      <span className="font-normal text-muted-foreground">
                        · {o.quantity}
                      </span>
                    </p>

                    <div className="mt-3 grid gap-1.5 text-xs text-muted-foreground sm:grid-cols-2">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        <span className="text-foreground">{o.buyerName}</span>
                      </div>
                      {o.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5" /> {o.phone}
                        </div>
                      )}
                      <div className="col-span-full flex items-start gap-1.5">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <span>{o.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 sm:flex-col">
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        disabled={o.status === s}
                        onClick={() => handleStatus(o._id, s)}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-all disabled:opacity-50 ${
                          o.status === s
                            ? "bg-primary text-primary-foreground"
                            : "border border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "sell" && (
          <div className="mx-auto max-w-2xl">
            <SellerChat />
          </div>
        )}
      </main>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { cls: string; icon: JSX.Element }> = {
    PLACED: { cls: "bg-amber-500/10 text-amber-600 dark:text-amber-400", icon: <Clock className="h-3 w-3" /> },
    PACKED: { cls: "bg-blue-500/10 text-blue-600 dark:text-blue-400", icon: <Package className="h-3 w-3" /> },
    SHIPPED: { cls: "bg-purple-500/10 text-purple-600 dark:text-purple-400", icon: <Truck className="h-3 w-3" /> },
    DELIVERED: { cls: "bg-primary/10 text-primary", icon: <CheckCircle2 className="h-3 w-3" /> },
  };
  const v = map[status] || map.PLACED;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${v.cls}`}>
      {v.icon} {status}
    </span>
  );
};

export default Admin;
