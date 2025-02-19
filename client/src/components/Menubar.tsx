import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { BASE_URL } from '../const';

function Menubar() {
  const navigate = useNavigate();
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleLogout = () => {
    axios.post(`${BASE_URL}auth/logout`).finally(() => {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      navigate("/login");
    });
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary site-header sticky-top py-2" style={{boxShadow:"2px 0 15px black"}}>
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/"><i className="bi bi-house"></i></Nav.Link>
            <Nav.Link href="/warehouse">Skladišča</Nav.Link>
            <Nav.Link href="/product">Izdelki</Nav.Link>
            <Nav.Link href="/inventory">Zaloga</Nav.Link>
            <Nav.Link href="/reports">Poročila</Nav.Link>
          </Nav>
        </Navbar.Collapse>

        <Navbar.Collapse className="justify-content-end column-gap-2">
          {user ? (
            <>
              <span>Welcome, {user}</span>
              <Button variant="danger" onClick={handleLogout}>Odjava</Button>
            </>
          ) : (
            <>
              <Button variant="primary" onClick={() => navigate('/login')}>Prijava</Button>
              <Button variant="primary" onClick={() => navigate('/register')}>Registracija</Button>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Menubar;
