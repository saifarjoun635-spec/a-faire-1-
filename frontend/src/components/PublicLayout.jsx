import React from "react";
import HeaderCmp from "./Header";
import Footer from "./Footer";

export default function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)]">
      <HeaderCmp />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
