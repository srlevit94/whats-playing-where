import React from "react";
import { Header, Footer, DisplayNearbyCinemas } from "./components";
import './App.css';
import InputZipCode from "./components/InputZipCode";
import DisplayShowtimes from "./components/DisplayShowtimes";


const App = () => {
  return (
    <div className="App">
        <Header />
        <InputZipCode />
        <DisplayShowtimes />
        <Footer />
    </div>
  );
}

export default App;
