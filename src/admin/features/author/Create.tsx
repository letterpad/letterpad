import React, { useEffect, useState } from "react";
// import { notify } from "react-notify-toast";

import Loader from "../../components/loader";

import Basic from "./Basic";
import StyledButton from "../../components/button";
import StyledSection from "../../components/section";
import StyledCard from "../../components/card";
import { RouteComponentProps } from "react-router-dom";
import apolloClient from "../../../shared/apolloClient";
import { GET_ROLES } from "../../../shared/queries/Queries";
import {
  getRoles_roles,
  getRoles,
} from "../../../shared/queries/types/getRoles";
import { createAuthorVariables } from "../../../shared/queries/types/createAuthor";
import { EnumRoles } from "../../../../types/globalTypes";

interface ICreateAuthorProps {
  router: RouteComponentProps;
}

const CreateAuthor: React.FC<ICreateAuthorProps> = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [roles, setRoles] = useState<getRoles_roles[]>([]);
  const [data, setData] = useState<createAuthorVariables>({
    email: "",
    roleName: EnumRoles.READER,
  });

  const fetchRoles = async () => {
    const { loading, data } = await apolloClient().query<getRoles>({
      query: GET_ROLES,
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
    console.log(data);
    // const update = await this.props.createAuthor(this.author);
    // let { errors } = update.data.createAuthor;
    // if (errors && errors.length > 0) {
    //   errors = errors.map(error => error.message);
    //   notify.show(errors.join("\n"), "error");
    // } else {
    //   notify.show("Author created", "success");
    //   this.props.history.push("/admin/authors");
    // }
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
            roles={roles}
            onRoleChange={selectRole}
          />
          <br />

          <br />
          <br />
          <br />
          <StyledButton success onClick={submitData}>
            Create Author
          </StyledButton>
        </React.Fragment>
      </StyledCard>
    </StyledSection>
  );
};

// class _Create extends Component {
//   static defaultProps = {
//     author: {
//       fname: "",
//       lname: "",
//       email: "",
//     },
//   };

//   static propTypes = {
//     author: PropTypes.object,
//     history: PropTypes.object,
//     createAuthor: PropTypes.func,
//     loading: PropTypes.bool,
//     roles: PropTypes.array,
//   };

//   author = {};

//   state = {
//     selectedRole: "4",
//   };

//   componentDidMount() {
//     this.setOption("roleId", this.state.selectedRole);
//     document.body.classList.add("create-author-page");
//   }

//   componentWillUnmount() {
//     document.body.classList.remove("create-author-page");
//   }

//   selectRole = roleId => {
//     this.setOption("roleId", roleId);
//     this.setState({ selectedRole: roleId });
//   };

//   setOption = (option, value) => {
//     this.author[option] = value;
//   };

//   submitData = async e => {
//     e.preventDefault();
//     const update = await this.props.createAuthor(this.author);
//     let { errors } = update.data.createAuthor;
//     if (errors && errors.length > 0) {
//       errors = errors.map(error => error.message);
//       notify.show(errors.join("\n"), "error");
//     } else {
//       notify.show("Author created", "success");
//       this.props.history.push("/admin/authors");
//     }
//   };

//   render() {}
// }

export default CreateAuthor;
