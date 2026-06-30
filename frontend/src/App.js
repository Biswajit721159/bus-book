import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from "./component/Home";
import Register from "./User/Register";
import Login from "./User/Login";
import MasterList from "./component/MasterList";
import Ticket_Book from "./component/Ticket_Book";
import LastTransaction from "./component/LastTransaction";
import WishList from "./component/WishList";
import CheckStatus from "./component/CheckStatus";
import Error from "./component/Error";
import View_Ticket from "./component/View_Ticket";
import View_Bus from "./component/View_Bus";
import FrontPage from "./component/FrontPage"
import ResponsiveAppBar from './component/ResponsiveAppBar'
import ForgotPassword from "./User/ForgotPassword";

function App() {
  return (
    <div>
      <Router>
        <ResponsiveAppBar />
        <Routes>
          <Route path="/" element={<FrontPage />}></Route>
          <Route path="/BookBus" element={<Home />}></Route>
          <Route path="/Register" element={<Register />}></Route>
          <Route path="/Login" element={<Login />}></Route>
          <Route path="/MasterList" element={<MasterList />}></Route>
          <Route path="LastTransaction" element={<LastTransaction />}></Route>
          <Route path="/WishList" element={<WishList />}></Route>
          <Route path="/checkstatus" element={<CheckStatus />}></Route>
          <Route path="/:bus_id/:src/:dist/:date" element={<Ticket_Book />}></Route>
          <Route path="/ForgotPassword" element={<ForgotPassword />}></Route>
          <Route path="/:_id" element={<View_Ticket />}></Route>
          <Route path="/View_Bus/:_id" element={<View_Bus />}></Route>
          <Route path="*" element={<Error />}></Route>
        </Routes>
      </Router>
      <ToastContainer theme="light"/>
    </div>
  );
}

export default App;
