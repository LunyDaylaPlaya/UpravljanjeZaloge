import { useState } from "react";
import { Button, Form, Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router";
import axios from "axios";
import { BASE_URL } from "../const";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await axios.post(`${BASE_URL}auth/register`, { name, email, password });
      navigate("/login");
    } catch (err) {
      setError("Registration failed");
    }
  };

  return (
    <Container style={{ maxWidth: "400px", marginTop: "2em" }}>
      <h2>Registracija</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleRegister}>
        <Form.Group className="mb-3">
          <Form.Label>Ime</Form.Label>
          <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Geslo</Form.Label>
          <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </Form.Group>
        <Button variant="primary" type="submit">Registracija</Button>
      </Form>
    </Container>
  );
}

export default Register;
