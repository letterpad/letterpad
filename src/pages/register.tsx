import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from "react-google-recaptcha-v3";
import React, { useState } from "react";

import {
  CreateAuthorMutation,
  CreateAuthorMutationVariables,
  CreateAuthorDocument,
} from "@/__generated__/queries/mutations.graphql";
import { useRouter } from "next/router";

import {
  Block,
  // Brand,
  Button,
  Container,
  InputBlock,
  Row,
} from "../components/login.css";
import { message } from "antd";
import { initializeApollo } from "@/graphql/apollo";

const key = "register";
const fields = {
  site_title: "",
  username: "",
  email: "",
  password: "",
  name: "",
};

const RegisterForm = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [form, setForm] = useState(fields);

  const [errors, setErrors] = useState(fields);

  const [processing, setProcessing] = useState(false);

  const router = useRouter();

  const registerAction = async () => {
    setProcessing(true);
    setErrors(fields);
    const errorObj = validate(form);

    const newErrors = Object.keys(errorObj).filter(
      field => errorObj[field] !== "",
    );

    if (newErrors.length > 0) {
      setErrors({ ...fields, ...errorObj });
      setProcessing(false);
      return;
    }
    message.loading({
      content: "Please wait",
      key,
      duration: 5,
    });
    if (executeRecaptcha) {
      const token = await executeRecaptcha("register");
      const formWithToken = { ...form, token };

      const result = await createAuthor(formWithToken);
      if (!result?.status) {
        message.error({ content: result?.message, key, duration: 5 });
      } else {
        message.success({ content: "Succcess", key, duration: 5 });
        router.push("/messages/registered");
      }
    }

    setProcessing(false);
  };

  return (
    <Container>
      <div className="login">
        <h1>Letterpad</h1>
        <Block isVisible={true}>
          <InputBlock>
            <input
              type="text"
              placeholder="Enter a title of your blog"
              value={form.site_title}
              onChange={e => setForm({ ...form, site_title: e.target.value })}
              autoComplete="off"
              data-testid="input-email"
            />
            {errors.site_title && (
              <span className="error">{errors.site_title}</span>
            )}
          </InputBlock>
          <InputBlock>
            <input
              type="text"
              placeholder="Enter your name as an author"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              autoComplete="off"
              data-testid="input-email"
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </InputBlock>
          <InputBlock>
            <input
              type="text"
              placeholder="Enter a username ( username.letterpad.app )"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              autoComplete="off"
              data-testid="input-email"
            />
            {errors.username && (
              <span className="error">{errors.username}</span>
            )}
          </InputBlock>
          <InputBlock>
            <input
              type="text"
              placeholder="Enter your email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              autoComplete="off"
              data-testid="input-email"
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </InputBlock>
          <InputBlock>
            <input
              type="password"
              placeholder="Enter a new password"
              onChange={e => setForm({ ...form, password: e.target.value })}
              value={form.password}
              autoComplete="off"
              onKeyUp={(e: React.KeyboardEvent) => {
                if (e.keyCode === 13) {
                  registerAction();
                }
              }}
              data-testid="input-password"
            />
            {errors.password && (
              <span className="error">{errors.password}</span>
            )}
          </InputBlock>
          <br />
          <Row justify="center">
            <Button
              onClick={registerAction}
              data-testid="btn-login"
              disabled={processing}
            >
              Register
            </Button>
          </Row>
        </Block>
      </div>
    </Container>
  );
};

const Provider = () => {
  return (
    <GoogleReCaptchaProvider reCaptchaKey="6LdCsL0aAAAAAPbGhkyrhAcr4I_-DkVZYabIkaEa">
      <RegisterForm />
    </GoogleReCaptchaProvider>
  );
};
export default Provider;

function validate(form: typeof fields) {
  const sanitisedForm = { ...form };
  const errors: typeof fields = { ...fields };
  for (const field in form) {
    sanitisedForm[field] = form[field].trim();
    if (sanitisedForm[field].length === 0) {
      errors[field] = `${field.replace("_", " ")} cannot be empty`;
    }
  }

  if (!/^[a-z0-9]+$/i.test(sanitisedForm.username)) {
    errors.username = "Username cannot contain spaces or special characters";
  }

  if (sanitisedForm.password.length < 6) {
    errors.password = "Password should have minimum 6 characters";
  }

  return errors;
}

async function createAuthor(
  data,
): Promise<{ status: boolean; message: string } | null> {
  const client = await initializeApollo();

  const result = await client.mutate<
    CreateAuthorMutation,
    CreateAuthorMutationVariables
  >({
    mutation: CreateAuthorDocument,
    variables: {
      data,
    },
  });

  if (result.data?.createAuthor?.__typename === "CreateAuthorError") {
    return {
      status: false,
      message: result.data.createAuthor.message,
    };
  }
  if (result.data?.createAuthor?.__typename === "Author") {
    return {
      status: true,
      message: "",
    };
  }
  return null;
}
