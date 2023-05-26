//Static imports:
import logo from './logo.svg';

//Component imports:
import HomePage from "./pages/HomePage";
import SignUp from './pages/SignUp';

//Page imports:
import CalendarPage from './pages/CalendarPage';
import LoginPage from './pages/LoginPage';
import ClubUserPage from './pages/ClubUserPage';
import ClubCreationPage from './pages/ClubCreationPage';
import OptimizerPageV4 from './pages/OptimizerPageV4';
import ClubPage from './pages/ClubPage';
import PageNotFound from './pages/PageNotFound';
import IcsPage from './pages/IcsPage';
import AboutUsPage from './pages/AboutUsPage';
import ClubSearchPage from './pages/ClubSearchPage';
import ExecutiveCalendarPage from './pages/ExecutiveCalendarPage';
import NewHomePage from './pages/NewHomePage';

import SchoolConfigSelect from './components/util/SchoolConfigSelect';


import CourseSearchWidget from './components/course_search/CourseSearchWidget';

//React & Lib imports:
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";



export default function App() {
  return (
    <Router>
      <Routes>
        
      {/* <Route path="/" element={<NewHomePage/>}></Route> */}
      
      <Route path="/login" element={<LoginPage/>}></Route>
      <Route path="/signup" element={<SignUp/>}></Route>
      <Route path="/ics" element={<IcsPage/>}></Route>

        {/* Temporary path */}
      <Route path="/cs_widget" element={<CourseSearchWidget/>}></Route>

      {/* <Route path="/calendar" element={<CalendarPage/>}></Route>
      <Route path="/optimize" element={<OptimizerPage/>}></Route>
      <Route path="/club/create" element={<ClubCreationPage/>}></Route>
      <Route path="/club/:uuid" element={<ClubPage/>}></Route>
      <Route path="/clubs" element={<ClubUserPage/>}></Route>
      <Route path="/events" element={<ClubSearchPage/>}></Route>
      */}
      <Route path="/optimize" element={<OptimizerPageV4/>}></Route> 

      <Route path="/executive" element={<ExecutiveCalendarPage/>}></Route>
      <Route path="/about/us" element={<AboutUsPage/>}></Route>      
      <Route path='*' exact={true} element={<IcsPage/>}></Route>

      </Routes>
     </Router>
   );
}
