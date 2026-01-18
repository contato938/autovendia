export function MarketingFooter() {
    return (
      <footer className="border-t bg-muted/30">
        <div className="container py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center">
              <span className="text-sm font-bold text-white">A</span>
            </div>
            <span className="font-semibold text-foreground">AutovendaIA</span>
            <span className="text-sm text-muted-foreground ml-2">© {new Date().getFullYear()}</span>
          </div>
          
          <div className="flex gap-6 text-sm text-muted-foreground">
            <span className="cursor-not-allowed opacity-70">Termos de Uso</span>
            <span className="cursor-not-allowed opacity-70">Privacidade</span>
          </div>
        </div>
      </footer>
    );
  }
