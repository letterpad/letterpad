import {
  CreateAuthorMutation,
  CreateAuthorMutationVariables,
  EnumRoles,
  Role,
  RolesQuery,
} from "../../../__generated__/gqlTypes";
import React, { useEffect, useState } from "react";

import Basic from "./Basic";
import { Button } from "../../components/button";
import { CREATE_AUTHOR } from "../../../shared/queries/Mutations";
import Loader from "../../components/loader";
import { QUERY_ROLES } from "../../../shared/queries/Queries";
import { RouteComponentProps } from "react-router-dom";
import StyledCard from "../../components/card";
import StyledSection from "../../components/section";
import StyledSelect from "../../components/select";
import apolloClient from "../../../shared/apolloClient";
import { notify } from "react-notify-toast";

interface ICreateAuthorProps {
  router: RouteComponentProps;
}

const CreateAuthor: React.FC<ICreateAuthorProps> = ({ router }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [roles, setRoles] = useState<Role[]>([]);
  const [data, setData] = useState<CreateAuthorMutationVariables>({
    email: "",
    roleName: EnumRoles.Reader,
  });
  const fetchRoles = async () => {
    const { loading, data } = await apolloClient().query<RolesQuery>({
      query: QUERY_ROLES,
    });
    if (data) {
      setRoles(data.roles);
    }
    setLoading(loading);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const selectRole = (roleName: EnumRoles) => {
    setData({ ...data, roleName });
  };

  const setOption = (option: string, value: string) => {
    setData({ ...data, [option]: value });
  };

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const result = await apolloClient(true).mutate<CreateAuthorMutation>({
      mutation: CREATE_AUTHOR,
      variables: {
        ...data,
      },
    });
    if (!result.data) {
      notify.show("There was a problem creating this author", "error");
      return;
    }
    if (result.data.createAuthor.ok) {
      notify.show("Author created", "success");
      router.history.push("/admin/authors");
      return;
    }
    let { errors } = result.data.createAuthor;
    if (errors && errors.length > 0) {
      const errorMessages = errors.map(error => error.message);
      notify.show(errorMessages.join("\n"), "error");
    }
  };

  if (loading) {
    return <Loader />;
  }
  return (
    <StyledSection
      title="Create Author"
      subtitle="Here you can create an author with an appropriate role for your blog"
    >
      <StyledCard title="" subtitle="">
        <React.Fragment>
          <Basic
            data={data}
            updateOption={setOption}
            onRoleChange={selectRole}
          />
          <br />
          <StyledSelect
            bold
            label="Role"
            selected={data.roleName}
            options={roles.map(role => {
              return { name: role.name, value: role.name };
            })}
            onChange={selectRole}
          />

          <br />
          <br />
          <br />
          <Button btnStyle="primary" onClick={submitData}>
            <i className="fa fa-plus" />
            Create Author
          </Button>
        </React.Fragment>
      </StyledCard>
    </StyledSection>
  );
};

export default CreateAuthor;
