import "./globals.css";
export const metadata = {
  title: "LeadPulse CRM",
  description: "Enterprise Lead and Sales Management System"
};
export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
