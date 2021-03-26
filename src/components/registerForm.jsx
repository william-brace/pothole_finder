import React, { useRef, useState } from "react";
import {
  Card,
  Button,
  Form,
  FormGroup,
  Input,
  CardBody,
  Alert,
} from "reactstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";

export const RegisterForm = (props) => {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const { register, currentUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await register(emailRef.current.value, passwordRef.current.value);

      history.push("/");
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <div className="form-container">
      <div className="mt-4">
        <div className="form-container_inside">
          <h1 className="mb-4 text-center text-primary">Create Your Account</h1>
          {error && <Alert color="danger">{error}</Alert>}
          {currentUser && currentUser.email && currentUser.role}
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              {/* <Label for="exampleEmail">Email</Label> */}
              <Input
                ref={nameRef}
                type="text"
                name="name"
                id="exampleName"
                placeholder="Full Name"
                size="lg"
              />
            </FormGroup>
            <FormGroup>
              {/* <Label for="exampleEmail">Email</Label> */}
              <Input
                innerRef={emailRef}
                type="email"
                name="email"
                id="exampleEmail"
                placeholder="Email"
                size="lg"
              />
            </FormGroup>
            <FormGroup>
              {/* <Label for="examplePassword">Password</Label> */}
              <Input
                innerRef={passwordRef}
                type="password"
                name="password"
                id="examplePassword"
                placeholder="Password"
                size="lg"
              />
            </FormGroup>
            <div className="form-container_buttonContainer">
              {!loading && (
                <Button
                  type="submit"
                  color="primary"
                  className="form-container_buttonContainer--button"
                  size="lg"
                >
                  Register
                </Button>
              )}
              {loading && (
                <Button
                  type="submit"
                  color="primary"
                  className="form-container_buttonContainer--button"
                  disabled
                >
                  Register
                </Button>
              )}
              <Button
                outline
                className="form-container_buttonContainer--button"
                color="primary"
                size="lg"
              >
                <Link to="signin w-100 h-100">Sign In</Link>
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
