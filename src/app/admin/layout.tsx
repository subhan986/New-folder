import { logout } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { LogOut, Package, Users, LineChart, Video, Image as ImageIcon, FileText, FolderKanban, Building, Settings } from "lucide-react";
import Link from "next/link";

const DLogo = () => (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary"
    >
      <path
        d="M13.23 3H7.01C4.79571 3 3 4.79571 3 7.01V16.99C3 19.2043 4.79571 21 7.01 21H13.23C17.5218 21 21 17.5218 21 13.23V10.77C21 6.47823 17.5218 3 13.23 3ZM13.23 18.5H7.01C6.17724 18.5 5.5 17.8228 5.5 16.99V7.01C5.5 6.17724 6.17724 5.5 7.01 5.5H13.23C16.1436 5.5 18.5 7.8564 18.5 10.77V13.23C18.5 16.1436 16.1436 18.5 13.23 18.5Z"
        fill="currentColor"
      />
    </svg>
  );

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <DLogo />
              <span className="font-headline">Demporium Admin</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/admin"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Package className="h-4 w-4" />
                Products
              </Link>
              <Link
                href="/admin/categories"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <FolderKanban className="h-4 w-4" />
                Categories
              </Link>
              <Link
                href="/admin/brands"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Building className="h-4 w-4" />
                Brands
              </Link>
              <Link
                href="/admin/pr"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Video className="h-4 w-4" />
                PR
              </Link>
              <Link
                href="/admin/media"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <ImageIcon className="h-4 w-4" />
                Media
              </Link>
              <Link
                href="/admin/content"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <FileText className="h-4 w-4" />
                Site Content
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
           <div className="w-full flex-1">
            {/* Can add search here later */}
          </div>
          <form action={logout}>
            <Button variant="ghost" size="icon">
                <LogOut className="h-5 w-5"/>
                <span className="sr-only">Logout</span>
            </Button>
          </form>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
