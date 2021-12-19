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
  background: #fff;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100vh;
  h1 {
    color: #3fb1ec;
    font-weight: 700;
    margin: 0px 10px 10px;
    font-family: system-ui;
    font-size: 1.4rem;
    text-transform: uppercase;
    /* text-align: right; */
  }
  .login {
    margin-top: 40px;
    border: 1px solid #dae1e3;
    padding: 40px;
    background: #f8fbfd;
    border-radius: 9px;
    width: 460px;

    .error {
      color: #ee7979;
      &::first-letter {
        text-transform: uppercase;
      }
    }
    @media (max-width: 800px) {
      width: 90vw;
    }
  }
`;
interface IRowProps {
  justify: string;
}
export const Row = styled.div<IRowProps>`
  display: flex;
  justify-content: ${(p) => p.justify};
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
    padding: 13px;
    margin-bottom: 30px;
  }
`;

export const Block = styled.div<ILoginContainerProps>`
  display: ${(p) => (p.isVisible ? "block" : "none")};
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
    border-radius: 4px;
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

  background: linear-gradient(#4ab6f0, #2fa5e4 60%, #2fa5e4 90%, #38a9e5);
  box-shadow: inset 0 1px 0 hsla(0, 0%, 100%, 0.1);
  /* background: ${(p) => (p.secondary ? "#d6d6d6" : "#56af76")}; */
  width: 100%;
  color: #fff;
  /* color: ${(p) => (p.secondary ? "#585454" : "#fff")}; */
`;
