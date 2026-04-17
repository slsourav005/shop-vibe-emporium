import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import SellerChat from "@/components/SellerChat";
import Navbar from "@/components/Navbar";

const Sell = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={() => {}} />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to marketplace
        </Link>

        <div className="mt-6 mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Sell on Vyapar Vaani</h1>
            <p className="text-sm text-muted-foreground">
              Just chat — our AI will list your products with fair prices.
            </p>
          </div>
        </div>

        <SellerChat />

        <div className="mt-6 rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Tips for best results:</p>
          <ul className="mt-2 space-y-1 list-inside list-disc">
            <li>Mention quantities clearly (e.g., "2 kg", "1 litre")</li>
            <li>Separate multiple items with "and" or commas</li>
            <li>Use simple product names — rice, honey, wheat, etc.</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Sell;
