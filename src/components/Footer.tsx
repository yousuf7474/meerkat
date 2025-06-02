export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto flex h-16 items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">
          © {currentYear} ScaleCapacity. All rights reserved.
        </p>
      </div>
    </footer>
  );
} 