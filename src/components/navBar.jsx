import React, { useEffect, useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { useHistory, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
// import { getUserData } from "../firestoreQueries";

const NavBar = (props) => {
  const user = props.user;
  const [isOpen, setIsOpen] = useState(false);
  // const [currentUserData, setCurrentUserData] = useState(null);
  const {
    logout,
    currentUser,
    setCurrentUser,
    currentUserData,
    setCurrentUserData,
  } = useAuth();
  const history = useHistory();

  // const getCurrentUserData = () => {
  //   if (currentUser) {
  //     getUserData(currentUser.uid).then((userData) => {
  //       setCurrentUserData(userData.data());
  //     });
  //   }
  // };

  // //Rund everytime the currentUser Changes
  // useEffect(() => {
  //   getCurrentUserData();
  //   if (currentUserData) console.log(currentUserData.role);
  // }, [currentUser]);

  const toggle = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    logout()
      .then(() => {
        history.push("/signin");
        setCurrentUser(null);
        setCurrentUserData(null);
      })
      .catch((error) => {
        console.log("unable to logout");
        console.log(error.message);
      });
  };

  return (
    <div>
      {console.log(`currentUserData: ${currentUserData}`)}
      {console.log(currentUser)}
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">PotholeFinder</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto " navbar>
            <NavItem>
              <Link to="/addpotholes">Add Pothole</Link>
            </NavItem>
            <NavItem>
              <Link to="/map">Map</Link>
            </NavItem>
            <NavItem>
              <Link to="/viewpotholes">View Potholes</Link>
            </NavItem>
            {!currentUserData && (
              <React.Fragment>
                <NavItem>
                  <Link to="/signin">Sign In</Link>
                </NavItem>
                <NavItem>
                  <Link to="/register">Register</Link>
                </NavItem>
              </React.Fragment>
            )}

            {currentUserData && currentUserData.role === "person" && (
              <React.Fragment>
                <NavItem>
                  <NavLink href="/">Profile</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink onClick={handleLogout}>Logout</NavLink>
                </NavItem>
              </React.Fragment>
            )}
            {currentUserData &&
              (currentUserData.role === "analyst" ||
                currentUserData.role === "manager") && (
                <React.Fragment>
                  <NavItem>
                    <NavLink href="/">Schedule</NavLink>
                  </NavItem>
                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret>
                      More
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem>
                        <NavItem>
                          <NavLink href="/">Profile</NavLink>
                        </NavItem>
                      </DropdownItem>
                      {currentUserData.role === "manager" && (
                        <DropdownItem>
                          <NavItem>
                            <NavLink href="/">Users</NavLink>
                          </NavItem>
                        </DropdownItem>
                      )}
                      <DropdownItem divider />
                      <DropdownItem>
                        <NavItem>
                          <NavLink onClick={handleLogout}>Logout</NavLink>
                        </NavItem>
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </React.Fragment>
              )}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default NavBar;
