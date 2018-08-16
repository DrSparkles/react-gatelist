/**
 * Gatelist page
 */
import React from "react";
// import moment from "moment";
import { inject, observer } from 'mobx-react';
import { GatelistPanels } from '../Gatelist';

@inject('commonStore', 'userStore')
@observer
export default class Gatelist extends React.Component {

  componentDidMount() {

  }

  /**
   * Render our document!
   * @returns {*}
   */
  render(){

    return (
      <div id='Gatelist'>
        <h2>Gatelist</h2>
        <GatelistPanels />
      </div>
    );
  }
}