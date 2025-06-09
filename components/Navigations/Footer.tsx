const Footer = ({ className }: { className?: string }) => {
  const date = new Date().getFullYear();
  return (
    <footer className={`${className}  h-16 max-lg:h-auto flex items-center justify-center border-t-0 border-border`}>
      <div className="_fixed bottom-0 bg-background max-w-7xl border border-b-0 border-border h-16 p-4 max-lg:py-2 flex max-lg:flex-col space-y-1.5 w-full justify-between items-center">
        <div className="font-serif tracking-wide">
          <p>© {date} Walter White. All rights reserved.</p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <span>Powered by</span>
          <span className="px-3 py-1.5 rounded-full border border-border-muted bg-background-dark">PresentDATA</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;