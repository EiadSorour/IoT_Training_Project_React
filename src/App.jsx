import React from "react";
import {BrowserRouter , Routes, Route} from "react-router-dom"
import LoginPage from "./pages/Login";
import UsersPage from "./pages/Users";

function App() {

  return (
    // Routing for pages
    <BrowserRouter>
      <Routes>
        <Route index element={<LoginPage />}/>
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/admin/users" element={<UsersPage />}/>

        <Route path="*" element={<h1>Not found</h1>}/>
      
      </Routes>
    </BrowserRouter>
  );
}

export default App;
