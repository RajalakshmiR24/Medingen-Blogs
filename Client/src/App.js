import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Blog } from "./components/Author/Blog";
import AuthorSection from "./components/Author/AuthorSection";

const App = () => {
  return (
    <Router>
      <>
        <Routes>
        <Route path="/blogs" element={<AuthorSection />} />
        <Route path="/blogs/:blogUrl" element={<Blog />} />
        </Routes>
      </>
    </Router>
  );
};

export default App;
