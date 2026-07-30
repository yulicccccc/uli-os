import type { ReactNode } from "react";

export const metadata = {
  title: "Uli OS",
  description: "A living cognitive operating system."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
