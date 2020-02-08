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
  background: #e8e8e8;
  background-repeat: no-repeat;
  background-size: cover;

  .login {
    margin-top: 40px;
    border: 1px solid #eee;
    padding: 40px;
    background: #ffffff;
    box-shadow: 0px 3px 11px -7px #000;
    border-radius: 9px;
  }
`;

export const Brand = styled.div`
  text-align: center;
  font-weight: 100;
  font-size: 40px;
  color: #f0e8e9;
  text-shadow: -1px 1px 27px #472532;
  font-family: "Source Sans Pro", sans-serif;
`;

export const Block = styled.div<ILoginContainerProps>`
  display: ${p => (p.isVisible ? "block" : "none")};
  color: #131313;
`;
export const RememberMeBlock = styled.div`
  padding: 10px;
  padding-left: 130px;
`;

export const InputBlock = styled.div`
  padding: 10px;
  label {
    display: inline-block;
    width: 120px;

    font-weight: 500;
  }
  input {
    border: 1px solid #eee;
    padding: 6px;
    width: 230px;
    border-radius: 2px;
  }
`;

interface IButtonProps {
  contained?: boolean;
  secondary?: boolean;
}

export const Button = styled.button<IButtonProps>`
  padding: 6px 12px;
  border: 1px solid #7170703d;
  cursor: pointer;
  margin-left: 132px;
  border-radius: 3px;
  background: #131313;
  color: #fff;
`;
