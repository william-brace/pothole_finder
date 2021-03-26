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
import { useHistory, Link, useLocation, useRouteMatch } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    logout,
    currentUser,
    setCurrentUser,
    currentUserData,
    setCurrentUserData,
  } = useAuth();
  const history = useHistory();

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

  const [currentPath, setCurrentPath] = useState();

  function SetRoute() {
    const location = useLocation();
    useEffect(() => {
      const currentPath = location.pathname;
      setCurrentPath(location.pathname);

      const searchParams = new URLSearchParams(location.search);
    }, [location]);
    return null;
  }

  return (
    <div>
      {SetRoute()}
      {console.log(`currentUserData: ${currentUserData}`)}
      {console.log(currentUser)}
      {console.log(currentPath)}
      {/* className="shadow-sm" */}
      <Navbar
        light
        color={currentPath === "/" ? null : "secondary"}
        expand="md"
      >
        <NavbarBrand
          tag={Link}
          to="/"
          className="font-weight-bold text-primary "
        >
          PotholeFinder
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink
                tag={Link}
                to="/addpotholes"
                className="navbar-item mx-3 nav-item nav-link"
                style={{ color: "#112d4e" }}
              >
                Add Potholes
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                tag={Link}
                to="/map"
                style={{ color: "#112d4e" }}
                className="navbar-item mx-3"
              >
                Map
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                tag={Link}
                to="/viewpotholes"
                className="navbar-item mx-3"
                style={{ color: "#112d4e" }}
              >
                View Potholes
              </NavLink>
            </NavItem>
            {!currentUserData && (
              <React.Fragment>
                <NavItem>
                  <NavLink
                    tag={Link}
                    to="/signin"
                    className="navbar-item mx-3"
                    style={{ color: "#112d4e" }}
                  >
                    Sign In
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    tag={Link}
                    to="/register"
                    className="navbar-item mx-3"
                    style={{ color: "#112d4e" }}
                  >
                    Register
                  </NavLink>
                </NavItem>
              </React.Fragment>
            )}

            {currentUserData && currentUserData.role === "person" && (
              <React.Fragment>
                <NavItem>
                  <NavLink
                    tag={Link}
                    to="/"
                    className="navbar-item mx-3"
                    style={{ color: "#112d4e" }}
                  >
                    Profile
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    tag={Link}
                    to="/"
                    onClick={handleLogout}
                    className="navbar-item mx-3"
                    style={{ color: "#112d4e" }}
                  >
                    Logout
                  </NavLink>
                </NavItem>
              </React.Fragment>
            )}
            {currentUserData &&
              (currentUserData.role === "analyst" ||
                currentUserData.role === "manager") && (
                <React.Fragment>
                  <NavItem>
                    <NavLink
                      tag={Link}
                      to="/"
                      className="navbar-item mx-3"
                      style={{ color: "#112d4e" }}
                    >
                      Schedule
                    </NavLink>
                  </NavItem>
                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle
                      nav
                      caret
                      className="navbar-item mx-3"
                      style={{ color: "#112d4e" }}
                    >
                      More
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem>
                        <NavItem>
                          <NavLink
                            tag={Link}
                            to="/"
                            className="navbar-item mx-3"
                            style={{ color: "#112d4e" }}
                          >
                            Profile
                          </NavLink>
                        </NavItem>
                      </DropdownItem>
                      {currentUserData.role === "manager" && (
                        <DropdownItem>
                          <NavItem>
                            <NavLink
                              tag={Link}
                              to="/"
                              className="navbar-item mx-3"
                              style={{ color: "#112d4e" }}
                            >
                              Users
                            </NavLink>
                          </NavItem>
                        </DropdownItem>
                      )}
                      <DropdownItem divider />
                      <DropdownItem>
                        <NavItem>
                          <NavLink
                            tag={Link}
                            to="/"
                            onClick={handleLogout}
                            className="navbar-item mx-3"
                            style={{ color: "#112d4e" }}
                          >
                            Logout
                          </NavLink>
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
