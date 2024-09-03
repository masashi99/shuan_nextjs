import { Button, Link } from "@/components/ui";
import { cn } from "@/libs";

export type NavButtonProps = {
  href: string;
  label: string;
  isActive?: boolean;
};

export function NavButton({ href, label, isActive }: NavButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      asChild
      className={cn(
        "text-white transition border-none rounded hover:bg-white/20 hover:text-white focus:bg-white/30",
        isActive ? "bg-white/10" : "bg-transparent",
      )}
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
}
