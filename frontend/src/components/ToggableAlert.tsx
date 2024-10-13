import { ReactNode } from "react";

interface Props {
    children: ReactNode;
    onClick: () => void;
  }

const ToggableAlert = ({children, onClick}: Props) => {
  return (
    <div className="alert alert-warning alert-dismissible fade show" role="alert">{children}
    <button type="button" onClick={onClick} className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>
  )
}

export default ToggableAlert