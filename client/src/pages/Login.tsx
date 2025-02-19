import { useState } from "react";
import { Button, Form, Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router";
import axios from "axios";
import { BASE_URL } from "../const";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await axios.post(`${BASE_URL}auth/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", res.data.user.name);
      navigate("/");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <Container style={{ maxWidth: "400px", marginTop: "2em" }}>
      <h2>Prijava</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Geslo</Form.Label>
          <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </Form.Group>
        <Button variant="primary" type="submit">Prijava</Button>
      </Form>
    </Container>
  );
}

export default Login;
