import React from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import './style.css';

import MainNav from '../MainNav';

/**
 * Site header
 */
@inject('userStore', 'commonStore')
@observer
class Header extends React.Component {
  render() {
    return (
      <div id='Header'>
        <nav className="navbar navbar-light">
          <h1 className='header-title'>
            <Link to="/">
              {this.props.commonStore.appName}
            </Link>
          </h1>
          <MainNav navPlacement='header' />
        </nav>
      </div>
    );
  }
}

export default Header;
