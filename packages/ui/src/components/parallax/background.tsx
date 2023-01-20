import { Background as BackgroundClass } from "./types";

export class Background extends BackgroundClass {
  static defaultProps = {
    className: "",
  };

  static isParallaxBackground = true;

  render(): JSX.Element {
    const { className, children } = this.props;
    return (
      <div className={`react-parallax-background ${className}`}>{children}</div>
    );
  }
}
