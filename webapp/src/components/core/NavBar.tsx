import React from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/cjs/Container";
import Nav from "react-bootstrap/cjs/Nav";
import Navbar from "react-bootstrap/cjs/Navbar";
import Data from "../../config/app.json";

const NavBar = () => {
    return (
        <div className="app-header">
            <Navbar>
                <Container>
                    <Navbar.Brand as={Link} to="/">{ Data.web_name }</Navbar.Brand>
                    <Nav>
                        {Data.navbar_menu.map((item, idx) => <Nav.Link key={idx} as={Link} to={item.path}>{item.label}</Nav.Link>)}
                    </Nav>
                </Container>
            </Navbar>
        </div>
    );
};

export default NavBar;
