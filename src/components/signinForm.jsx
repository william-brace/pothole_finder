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

export const SigninForm = () => {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const { signin, currentUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await signin(emailRef.current.value, passwordRef.current.value);

      history.push("/");
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <Card className="mt-4">
      <CardBody>
        <h2 className="mb-4 text-center">Sign In</h2>
        {error && <Alert color="danger">{error}</Alert>}
        <Form className="mt-4" onSubmit={handleSubmit}>
          <FormGroup>
            {/* <Label for="exampleEmail">Email</Label> */}
            <Input
              innerRef={emailRef}
              type="email"
              name="email"
              id="exampleEmail"
              placeholder="Email"
              required
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
              required
            />
          </FormGroup>
          <div className="d-flex justify-content-between">
            {!loading && (
              <Button type="submit" color="primary">
                Sign In
              </Button>
            )}
            {loading && (
              <Button type="submit" color="primary" disabled>
                Sign In
              </Button>
            )}
            <Button outline type="submit" color="primary">
              <Link to="register">Register</Link>
            </Button>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
};

export default SigninForm;
