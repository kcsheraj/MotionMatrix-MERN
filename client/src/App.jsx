import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import PR from "./pages/PR";
import Weight from "./pages/Weight";
import WorkoutRoutine from "./pages/WorkoutRoutine";
import Explore from "./pages/Explore";

export default function App() {
  return (
    <BrowserRouter>
      {/* header */}
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/prs" element={<PR />} />
          <Route path="/weight" element={<Weight />} />
          <Route path="/workoutroutine" element={<WorkoutRoutine />} />
          <Route path="/explore" element={<Explore />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
