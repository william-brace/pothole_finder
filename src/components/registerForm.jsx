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
    <Card className="mt-4">
      <CardBody>
        <h2 className="mb-4 text-center">Create Your Account</h2>
        {error && <Alert color="danger">{error}</Alert>}
        {currentUser && currentUser.email && currentUser.role}
        <Form className="mt-4" onSubmit={handleSubmit}>
          <FormGroup>
            {/* <Label for="exampleEmail">Email</Label> */}
            <Input
              ref={nameRef}
              type="text"
              name="name"
              id="exampleName"
              placeholder="Full Name"
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
            />
          </FormGroup>
          <div className="d-flex justify-content-between">
            {!loading && (
              <Button type="submit" color="primary">
                Register
              </Button>
            )}
            {loading && (
              <Button type="submit" color="primary" disabled>
                Register
              </Button>
            )}
            <Button outline type="submit" color="primary">
              <Link to="signin">Sign In</Link>
            </Button>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
};

export default RegisterForm;
