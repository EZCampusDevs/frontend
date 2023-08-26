//lib imports:
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

//Static imports:
import logo from './logo.svg';
import { tos } from './util/textblock';

//Component imports:
import HomePage from "./pages/HomePage";
import SignUp from './pages/SignUp';

//Page imports:
import CalendarPage from './pages/CalendarPage';

import NewCalendar from './components/calendar/NewCalendar';

import ClubUserPage from './pages/ClubUserPage';
import ClubCreationPage from './pages/ClubCreationPage';
import OptimizerPageV4 from './pages/OptimizerPageV4';
import ClubPage from './pages/ClubPage';
import ExportCoursesPage from './pages/ExportCoursesPage';

import AboutUsPage from './pages/AboutUsPage';
import ClubSearchPage from './pages/ClubSearchPage';
import ExecutiveCalendarPage from './pages/ExecutiveCalendarPage';
import NewHomePage from './pages/NewHomePage';
import TextBlockPage from './pages/TextBlockPage';

import SchoolConfigSelect from './components/util/SchoolConfigSelect';
import CourseSearchWidget from './components/course_entry/CourseSearchWidget';

import SchoolRoutePage from './pages/SchoolRoutePage';

//Newer Bootstrap Pages:
import PageNotFoundPage from './pages/PageNotFoundPage';
import NewLoginPage from './pages/NewLoginPage';
import NewSignUpPage from './pages/NewSignUpPage';

//? Note: In app is where we do all school routing at the sub-domain level

import NewCalendarContainer1 from './components/calendar/NewCalendarContainer1';
import GoogleOAuthSuccessPage from './pages/GoogleOAuthSuccessPage';


export default function App() {
  return (<Router>
      <Routes>
        
      {/* <Route path="/" element={<NewHomePage/>}></Route> */}
      
      <Route path="/signup" element={<SignUp/>}></Route>
      <Route path="/export" element={<ExportCoursesPage/>}></Route>
      <Route path="/calendar_testing" element={<NewCalendar/>}></Route>
      <Route path="/c/1" element={<NewCalendarContainer1/>}></Route>

        {/* Temporary path */}
      <Route path="/cs_widget" element={<CourseSearchWidget/>}></Route>
      <Route path="/404" element={<PageNotFoundPage/>}></Route>
      {/* <Route path="/calendar" element={<CalendarPage/>}></Route>
      <Route path="/optimize" element={<OptimizerPage/>}></Route>
      <Route path="/club/create" element={<ClubCreationPage/>}></Route>
      <Route path="/club/:uuid" element={<ClubPage/>}></Route>
      <Route path="/clubs" element={<ClubUserPage/>}></Route>
      <Route path="/events" element={<ClubSearchPage/>}></Route>
      */}
      <Route path="/optimize" element={<OptimizerPageV4/>}></Route> 
      <Route path="/institutions" element={<SchoolRoutePage/>}></Route>

      <Route path="/tos" element={<TextBlockPage titleStr={"Terms Of Service"} paragraphJSX={tos}/>}></Route>

      <Route path="/executive" element={<ExecutiveCalendarPage/>}></Route>
      <Route path="/about/us" element={<AboutUsPage/>}></Route>      
      <Route path='*' exact={true} element={<ExportCoursesPage/>}></Route>
        
      {/* Bootstrapified Components: */}
      <Route path="/login" element={<NewLoginPage/>}></Route>


      {/* GOOGLE OAUTH SUCCESS ROUTE */}
      <Route path="/google-auth-callback" element={<GoogleOAuthSuccessPage/>}></Route>      



      </Routes>
     </Router>
   );
}
