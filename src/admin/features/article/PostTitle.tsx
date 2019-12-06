import React from "react";

interface IPostTitleProps {
  text: string;
  onChange: (title: string) => void;
  placeholder: string;
}

const PostTitle: React.FC<IPostTitleProps> = ({
  text,
  onChange,
  placeholder,
}) => {
  const [title, setTitle] = React.useState(text);

  const onTitleChange = (title: string) => {
    // const title = (e.target as HTMLHeadingElement).innerHTML;
    setTitle(title);
    if (typeof onChange === "function") {
      onChange(title);
    }
  };

  // const onPaste = evt => {
  //   if (this.titleNode.current) {
  //     this.titleNode.current.innerText = evt.currentTarget.innerText;
  //   }
  // };

  return (
    <h1
      // onInput={onTitleChange}
      onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
        onTitleChange(e.target.innerHTML)
      }
      contentEditable={true}
      onPaste={(e: React.ClipboardEvent) =>
        onTitleChange(e.clipboardData.getData("text"))
      }
      placeholder={placeholder}
      onKeyDown={(e: React.KeyboardEvent<HTMLHeadingElement>) => {
        if (e.keyCode === 13) {
          e.preventDefault();
        }
        onTitleChange((e.target as HTMLHeadingElement).innerHTML);
      }}
    >
      {title}
    </h1>
  );
};

export default PostTitle;
// export default class ContentEditable extends Component<any, any> {
//   // static propTypes = {
//   //   text: PropTypes.string,
//   //   onChange: PropTypes.func,
//   //   onBlur: PropTypes.func,
//   //   disabled: PropTypes.bool,
//   //   children: PropTypes.object,
//   // };

//   titleNode = React.createRef<HTMLHeadingElement>();

//   componentDidMount() {
//     this.titleNode.current.innerText = this.props.text;
//   }

//   shouldComponentUpdate() {
//     return false;
//   }

//   emitChange = evt => {
//     const text = evt.target.innerText;

//     if (this.props.onChange) {
//       // Clone event with Object.assign to avoid
//       // "Cannot assign to read only property 'target' of object"
//       let enhancedEvt = Object.assign({}, evt, {
//         target: {
//           value: text,
//         },
//       });
//       this.props.onChange(enhancedEvt);
//     }
//   };

//   onPaste = evt => {
//     if (this.titleNode.current) {
//       this.titleNode.current.innerText = evt.currentTarget.innerText;
//     }
//   };

//   render() {
//     return (
//       <h1
//         {...this.props}
//         ref={this.titleNode}
//         onInput={this.emitChange}
//         onBlur={this.props.onBlur || this.emitChange}
//         contentEditable={!this.props.disabled}
//         onPaste={this.onPaste}
//         onKeyDown={e => {
//           if (e.keyCode === 13) {
//             e.preventDefault();
//           }
//         }}
//       />
//     );
//   }
// }
