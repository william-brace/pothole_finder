import "./App.css";
import React, { useEffect, useState } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import NavBar from "./components/navBar";
import SigninForm from "./components/signinForm";
import RegisterForm from "./components/registerForm";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/protectedRoute";
import AddPotholes from "./components/addPotholes";
import Map from "./components/map";
import ViewPotholes from "./components/viewPotholes";
import MapBox from "./components/mapBox";
import ViewAPothole from "./components/viewAPothole";
import MapPageMap from "./components/mapPageMap";
import MapPage from "./components/MapPage";
import LongCard from "./components/longCard";
import LandingPage from "./components/landingPage";
import { useAuth } from "./contexts/AuthContext";
import { ProtectedRouteSignedIn } from "./components/ProtectedRouteSignedIn";
import NotFound from "./components/NotFound";

function App() {
  return (
    <React.Fragment>
      <AuthProvider>
        <NavBar />
        <main>
          <Switch>
            <ProtectedRouteSignedIn path="/register" component={RegisterForm} />
            {/* protects pages than should only be accessed if you are not logged in by redirecting to home page */}
            <ProtectedRouteSignedIn path="/signin" component={SigninForm} />
            <ProtectedRoute path="/addpotholes" component={AddPotholes} />
            <Route path="/viewpotholes" component={ViewPotholes} />
            <Route path="/viewapothole/:id" component={ViewAPothole} />
            <Route path="/map" component={MapPage} />
            <Route path="/" exact component={LandingPage} />
            <Route component={NotFound} />
            <Redirect to="/not-found" />
          </Switch>
        </main>
      </AuthProvider>
    </React.Fragment>
  );
}

export default App;
