import { Link } from "react-router-dom";
import { FlagIcon } from "./icons";

export default function BrandLogo() {
  return (
    <Link to="/" className="brand-logo group">
      <span className="brand-mark">
        <FlagIcon className="h-5 w-5" />
      </span>
      <span className="brand-text">
        Race<span className="text-gradient">IQ</span> AI
      </span>
    </Link>
  );
}
