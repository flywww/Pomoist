import { Link } from "react-router-dom";

export const NavigationBar = () => {
    return(
        <div className="nav">
            <h1 className="nav__title">Pomoist</h1>
            <ul className="nav__list">
                <li className="nav__item">
                    <Link className="nav__link" to="/">Todo</Link>
                </li>
                <li>
                    <Link className="nav__link" to="/Setting">Setting</Link>
                </li>
            </ul>
        </div>
    )
}