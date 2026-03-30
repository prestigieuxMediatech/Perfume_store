import About from "./components/About";
import Experience from "./components/Experience";
import Hero from "./components/Hero";
import Products from "./components/Products";
import Reviews from "./components/Reviews";
import React from "react";

function Home() {
  return (
    <div>
      <Hero />
      <About />
      <Products />
      <Experience />
      <Reviews />
    </div>
  );
}

export default Home;