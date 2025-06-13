import Copyright from "../Elements/Copyright";

const Footer = ({ className }: { className?: string }) => {
  const date = new Date().getFullYear();
  return (
    <footer className={`${className} h-16 flex items-center justify-center border-t-0 border-border  overflow-hidden`}>
      <div className="_fixed bottom-0 bg-background max-w-7xl border border-b-0 max-lg:border-0 max-lg:border-t border-border h-16 p-4 max-lg:py-2 flex max-lg:flex-col space-y-0.5 w-full justify-between items-center">
        <div className="font-serif tracking-wide">
          <p>© {date} Walter White. All rights reserved.</p>
        </div>
        <Copyright />
      </div>
    </footer>
  );
};

export default Footer;