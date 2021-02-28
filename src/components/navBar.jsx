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
  Alert,
} from "reactstrap";
import { useHistory, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { firestore } from "../firebase";
import { getUserData } from "../firestoreQueries";

const NavBar = (props) => {
  const user = props.user;
  const [isOpen, setIsOpen] = useState(false);
  const [currentUserDb, setCurrentUserDb] = useState(null);
  const { logout, currentUser } = useAuth();
  const history = useHistory();

  const getCurrentUserData = () => {
    if (currentUser) {
      getUserData(currentUser.uid).then((userData) => {
        setCurrentUserDb(userData.data());
      });
    }
  };
  useEffect(() => {
    getCurrentUserData();
    if (currentUserDb) console.log(currentUserDb.role);
  }, [currentUser]);

  const toggle = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    logout()
      .then((value) => {
        history.push("/signin");
        setCurrentUserDb(null);
      })
      .catch((error) => {
        console.log("unable to logout");
        console.log(error.message);
      });
  };

  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">PotholeFinder</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto " navbar>
            <NavItem>
              <NavLink href="/">Add Pothole</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/">Map</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/">View Potholes</NavLink>
            </NavItem>
            {!currentUserDb && (
              <React.Fragment>
                <NavItem>
                  <Link to="/signin">Sign In</Link>
                </NavItem>
                <NavItem>
                  <NavLink href="/register">Register</NavLink>
                </NavItem>
              </React.Fragment>
            )}

            {currentUserDb && currentUserDb.role === "person" && (
              <React.Fragment>
                <NavItem>
                  <NavLink href="/">Profile</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink onClick={handleLogout}>Logout</NavLink>
                </NavItem>
              </React.Fragment>
            )}
            {currentUserDb &&
              (currentUserDb.role === "analyst" ||
                currentUserDb.role === "manager") && (
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
                      {currentUserDb.role === "manager" && (
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
