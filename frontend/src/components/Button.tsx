import { CSSProperties, ReactNode } from "react";

interface Props {
    children: ReactNode;
    onClick: () => void;
    style?: CSSProperties;
  }

const Button = ({children, onClick, style} : Props) => {
    const defaultStyles: React.CSSProperties = {
        padding: '10px 20px',
        backgroundColor: 'blue',
        color: 'white',
        borderRadius: '5px',
        border: 'none',
        cursor: 'pointer',
        marginTop: 5,
        marginBottom: 5
      };
  return (
    <button type="button" className="btn btn-primary" onClick={onClick} style={{ ...defaultStyles, ...style }}>{children}</button>
  );
};

export default Button;