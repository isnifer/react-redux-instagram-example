import React from 'react';
import { Link } from 'react-router';

const userId = localStorage.userId;

const App = ({routes, children}) => {
    const links = routes[0].childRoutes.slice(0, 4).map((link, i) => {
        return (
            <li className="menu__item" key={i}>
                <Link
                    className="menu__link"
                    to={link.path === 'profile/:id' ? link.path.replace(':id', userId) : link.path}>
                    {link.name}
                </Link>
            </li>
        );
    });

    return (
        <div>
            <header className="header">
                <ul className="menu g-clf">
                    {links}
                </ul>
            </header>
            <div className="main g-clf">
                {children}
            </div>
            <footer className="footer">
                <ul className="social">
                    <li className="social__item">
                        <a className="social__link icon-facebook" href="https://facebook.com/isnifee"></a>
                    </li>
                    <li className="social__item">
                        <a className="social__link icon-twitter" href="https://twitter.com/isnifer"></a>
                    </li>
                    <li className="social__item">
                        <a className="social__link icon-VK" href="https://vk.com/isnifer"></a>
                    </li>
                    <li className="social__item">
                        <a className="social__link icon-GitHub-circle" href="https://github.com/isnifer"></a>
                    </li>
                </ul>
                <div className="footer__copyright">
                    &copy; Anton Kuznetsov
                    <span className="footer__rights">
                        . Instagram App. All rights on left!
                    </span>
                </div>
            </footer>
        </div>
    );
}

export default App;
