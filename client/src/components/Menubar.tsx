import { Button, Container, Nav, Navbar, Modal, Form, Toast, ToastContainer } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';

function Menubar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const updateUser = () => {
    const storedFirstName = localStorage.getItem("firstName");
    const storedLastName = localStorage.getItem("lastName");
    const storedEmail = localStorage.getItem("email");

    if (storedFirstName && storedLastName && storedEmail) {
      setUser(`${storedFirstName} ${storedLastName}`);
      setFirstName(storedFirstName);
      setLastName(storedLastName);
      setEmail(storedEmail);
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    updateUser();

    const message = localStorage.getItem("toastMessage");
    if (message) {
      setToastMessage(message);
      setShowToast(true);
      localStorage.removeItem("toastMessage");
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("email");
    localStorage.removeItem("token");

    setUser(null);
    navigate("/login");

    setToastMessage("Uspešno ste se odjavili.");
    setShowToast(true);
  };

  const handleSaveProfile = () => {
    localStorage.setItem("firstName", firstName);
    localStorage.setItem("lastName", lastName);
    localStorage.setItem("email", email);
    
    setUser(`${firstName} ${lastName}`);
    setShowProfileModal(false);

    setToastMessage("Podatki so bili uspešno posodobljeni!");
    setShowToast(true);
  };

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary site-header sticky-top py-2" style={{ boxShadow: "2px 0 15px black" }}>
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
                <span>Dobrodošli, {user}</span>
                <Button variant="danger" onClick={handleLogout}>Odjava</Button>
                <Button variant="primary" onClick={() => setShowProfileModal(true)}>Profil</Button>
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

      <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Vaš Profil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Ime</Form.Label>
              <Form.Control type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Priimek</Form.Label>
              <Form.Control type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProfileModal(false)}>Zapri</Button>
          <Button variant="primary" onClick={handleSaveProfile}>Shrani</Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-center" className="p-3">
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
          <Toast.Header>
            <strong className="me-auto">Obvestilo</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default Menubar;
