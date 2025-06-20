import { Search, Plus, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { HeaderMenu } from "./header-menu";

interface HeaderProps {
  title: string;
  description: string;
  onAdd?: () => void;
  addButtonText?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export default function Header({
  title,
  description,
  onAdd,
  addButtonText = "Nouveau",
  searchValue = "",
  onSearchChange,
}: HeaderProps) {
  const [, setLocation] = useLocation();

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/")}
            className="hover:bg-accent"
            title="Retour à l'accueil"
          >
            <Home className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            <p className="text-muted-foreground mt-1">{description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {onSearchChange && (
            <div className="relative">
              <Input
                type="text"
                placeholder="Rechercher..."
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 w-64"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            </div>
          )}
          {onAdd && (
            <Button onClick={onAdd} className="btn-accent">
              <Plus className="mr-2 h-4 w-4" />
              {addButtonText}
            </Button>
          )}
          <HeaderMenu />
        </div>
      </div>
    </header>
  );
}
