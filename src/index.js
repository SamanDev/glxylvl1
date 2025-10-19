import React from "react";

import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import TourSite from "./toursite";




const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

// 👇️ wrap App in Router

root.render(<BrowserRouter>
  <TourSite />
</BrowserRouter>);

