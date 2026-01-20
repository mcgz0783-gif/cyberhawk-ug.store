import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EbooksHome from "./EbooksHome";
import EbookDetail from "./EbookDetail";
import EbookCheckout from "./EbookCheckout";
import EbookSuccess from "./EbookSuccess";
import EbooksAdmin from "./EbooksAdmin";

export const EbooksLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route index element={<EbooksHome />} />
          <Route path=":slug" element={<EbookDetail />} />
          <Route path=":slug/checkout" element={<EbookCheckout />} />
          <Route path="success/:accessToken" element={<EbookSuccess />} />
          <Route path="admin" element={<EbooksAdmin />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default EbooksLayout;
