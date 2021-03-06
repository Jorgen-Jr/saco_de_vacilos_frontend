import { Button, Flex, FormControl } from "@chakra-ui/core";
import { Form, Formik } from "formik";

import HomeLayout from "../../components/HomeLayout";
import { FormInput } from "../../components/Form/FormInput";
import { toErrorMap } from "../../util/toErrorMap";

import { useRouter } from "next/router";
import { useLoginMutation } from "../../generated/graphql";
import { Link } from "@chakra-ui/core";
import { createUrqlClient } from "../../util/createUrqlClient";
import { withUrqlClient } from "next-urql";

const styles = {
  input_style: { borderRadius: "30px" },
  input_button: { borderRadius: "30px" },
};

interface LoginProps {}

const Login: React.FC<LoginProps> = ({}) => {
  const [, login] = useLoginMutation();
  const router = useRouter();

  return (
    <HomeLayout>
      <div className="login-welcome">
        <h1 className="login-title">Entre</h1>
        <p>Favor entrar com suas credenciais.</p>
      </div>

      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login(values);

          if (response.data?.login.errors) {
            console.log(toErrorMap(response.data.login.errors));
            setErrors(toErrorMap(response.data.login.errors));
          } else {
            if (typeof router.query.next === "string") {
              router.push(router.query.next);
            } else {
              router.push("/");
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <FormControl>
              <FormInput
                name="usernameOrEmail"
                placeholder="Nome de Usuário ou Email"
                label="Nome de usuário ou email"
                style={styles.input_style}
              />
              <FormInput
                name="password"
                placeholder="Senha"
                label="Senha"
                type="password"
                style={styles.input_style}
              />
            </FormControl>

            <Flex>
              <Button
                isLoading={isSubmitting}
                style={styles.input_button}
                mt="10px"
                onClick={() => router.push("/forgotpassword")}
              >
                Esqueceu sua senha?
              </Button>

              <Button
                type="submit"
                isLoading={isSubmitting}
                style={styles.input_button}
                variantColor="green"
                mt="10px"
              >
                Login
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>

      <div className="new-user">
        <p>
          Não possui Conta? Se registre em{" "}
          <Link onClick={() => router.push("/register")}>Cadastro</Link>
        </p>
      </div>
    </HomeLayout>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
