import { ShoppingBag, Search, Menu } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  onSearch: (query: string) => void;
}

const Navbar = ({ onSearch }: NavbarProps) => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold text-foreground">
            Vyapar<span className="text-primary"> Vaani</span>
          </span>
        </div>

        <div className="hidden items-center gap-1 rounded-full border border-border bg-muted/50 px-3 py-1.5 sm:flex sm:w-80">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full bg-transparent px-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:hidden"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-border px-4 py-2 sm:hidden">
          <div className="flex items-center gap-1 rounded-full border border-border bg-muted/50 px-3 py-1.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-transparent px-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              onChange={(e) => onSearch(e.target.value)}
              autoFocus
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
