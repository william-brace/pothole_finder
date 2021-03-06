import "./App.css";
import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import NavBar from "./components/navBar";
import SigninForm from "./components/signinForm";
import RegisterForm from "./components/registerForm";
import { AuthProvider } from "./contexts/AuthContext";
import { PotectedRoute } from "./components/protectedRoute";
import AddPotholes from "./addPotholes";

function App() {
  const user = {
    role: "manager",
  };

  // const [users, setUsers] = React.useState([]);

  // {
  //   React.useEffect(() => {
  //     const fetchData = async () => {
  //       const db = firebase.firestore().collection("users");
  //       const data = await db.get();
  //       const users = data.docs.map((doc) => doc.data());
  //       setUsers(users);
  //     };
  //     fetchData();
  //   }, []);
  // }

  return (
    <React.Fragment>
      <AuthProvider>
        <NavBar user={user} />
        {/* <div>
          {users.map((user) => (
            <h1 key={user.email}>{user.name}</h1>
          ))}
        </div> */}

        <main className="container">
          <Switch>
            <Route path="/register" component={RegisterForm} />
            <Route path="/signin" component={SigninForm} />
            <Route path="/addpotholes" component={AddPotholes} />

            {/* <Route path="/not-found" component={NotFound} /> */}
            <Redirect from="/" exact to="/" />
            <Redirect to="/not-found" />
          </Switch>
        </main>
      </AuthProvider>
    </React.Fragment>
  );
}

export default App;
