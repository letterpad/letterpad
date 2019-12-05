import styled from "styled-components";

interface ILoginContainerProps {
  isVisible: boolean;
}

export const Container = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100vh;
  background: url("/admin/images/login_bg.jpg");
  background-repeat: no-repeat;
  background-size: cover;
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
  color: #c7b8b4;
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

const applySecondaryContained = () => `
    background: #eee;
    color: #222;
`;

export const Button = styled.button<IButtonProps>`
  background: ${p => p.contained && "#EEE"};

  ${p => p.secondary && p.contained && applySecondaryContained()}
`;
