import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { colors } from "../values/colors";
import { Link } from "react-router-dom";

function HorizontalNavbar() {
  const linkStyle = {
    fontWeight: "400",
    fontSize: "20px",
    fontFamily: "MuseoModerno",
    color: colors.lightSkyBlue,
    marginRight: "5rem",
  };

  return (
    <Navbar
      expand="lg"
      style={{ backgroundColor: colors.black }}
      variant="dark"
    >
      <Container style={{ marginTop: "2rem" }}>
        <Navbar.Brand
          as={Link}
          to="/Friendz/v1/landing"
          style={{
            fontFamily: "MuseoModerno",
            fontWeight: "600",
            fontSize: "30px",
            color: colors.lightSkyBlue,
          }}
        >
          Wealth View
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="m-auto" variant="tabs">
            <Nav.Link
              as={Link}
              style={{
                ...linkStyle,
                marginRight: "0",
              }}
              to="/Friendz/v1/login"
            >
              Login/Signup
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default HorizontalNavbar;
