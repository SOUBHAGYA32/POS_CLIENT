import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import "antd/dist/antd.css";
import { Button } from "antd";
import './App.css';
//Pages
import Loginpage from './pages/Login/Loginpage';
import Registerpage from './pages/Register/Registerpage';
import Homepage from './pages/Home/Homepage';
import Itempage from './pages/Items/Itempage';
import Cartpage from './pages/Cart/Cartpage';
import Customerpage from './pages/Customers/Customerpage';
import Billpage from './pages/Bills/Billpage';
import Planpage from './pages/Plan/Planpage';
import Account from './pages/Account/Account';


function App() {
  return (
    <div className="App">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Loginpage />} />
        <Route path="/plan" element={<Planpage />} />
        <Route path='/home' element={<ProtectedRoute><Homepage/></ProtectedRoute>}/>
        <Route path='/items' element={<ProtectedRoute><Itempage/></ProtectedRoute>}/>
        <Route path='/account' element={<ProtectedRoute><Account/></ProtectedRoute>}/>
        <Route path='/cart' element={<ProtectedRoute><Cartpage/></ProtectedRoute>}/>
        <Route path='/customers' element={<ProtectedRoute><Customerpage/></ProtectedRoute>}/>
        <Route path='/bills' element={<ProtectedRoute><Billpage/></ProtectedRoute>}/>
        <Route path='/login' element={<Loginpage/>}/>
        <Route path='/register' element={<Registerpage/>}/>
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;

export function ProtectedRoute({children}){
  const user = localStorage.getItem('pos-user');
  const plan = user.plan;
  if(user){
    return children;
  } else {
    return <Navigate to='/login'/>
  }
}