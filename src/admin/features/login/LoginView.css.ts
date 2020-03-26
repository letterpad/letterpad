import styled from "styled-components";

interface ILoginContainerProps {
  isVisible: boolean;
}

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  /* background: url("/admin/images/login_bg.jpg"); */
  background: #45a760;
  background-repeat: no-repeat;
  background-size: cover;

  .login {
    margin-top: 40px;
    border: 1px solid #eee;
    padding: 40px;
    background: #ffffff;
    box-shadow: 0px 3px 11px -7px #000;
    border-radius: 9px;
    width: 460px;
  }
`;
interface IRowProps {
  justify: string;
}
export const Row = styled.div<IRowProps>`
  display: flex;
  justify-content: ${p => p.justify};
  align-items: center;
`;

export const Brand = styled.div`
  text-align: center;
  text-shadow: none;
  color: #151a21;
  font-weight: 400;
  font-size: 1.8rem;
  margin-bottom: 14px;
  font-family: "Source Sans Pro", sans-serif;
  img {
    background: #040404;
    padding: 13px;
    margin-bottom: 30px;
    border-radius: 10px;
  }
`;

export const Block = styled.div<ILoginContainerProps>`
  display: ${p => (p.isVisible ? "block" : "none")};
  color: #131313;
`;
export const RememberMeBlock = styled.div`
  padding: 10px;
`;

export const InputBlock = styled.div`
  padding: 10px;
  label {
    display: inline-block;
    width: 120px;

    font-weight: 500;
  }
  input {
    border: 1px solid #cecece;
    padding: 12px 6px;
    width: 100%;
    border-radius: 10px;
  }
  a {
    color: #44a760;
  }
`;

interface IButtonProps {
  contained?: boolean;
  secondary?: boolean;
}

export const Button = styled.button<IButtonProps>`
  padding: 8px 12px;
  border: 1px solid #7170703d;
  cursor: pointer;
  border-radius: 3px;
  background: ${p => (p.secondary ? "#d6d6d6" : "#56af76")};
  width: 100%;
  color: ${p => (p.secondary ? "#585454" : "#fff")};
`;
