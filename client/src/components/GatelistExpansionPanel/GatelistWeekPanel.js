import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import './style.css';

import { GatelistForm } from '../GatelistForm';
import { GatelistList } from "../GatelistList";
import {inject, observer} from "mobx-react";

@inject('interfaceStore')
@observer
class GLWeekPanel extends React.Component {

  handleChangeWeek = week => (event, expanded) => {
    console.log('changed week: expanded, week', expanded, week);
    if (expanded === true){
      this.props.interfaceStore.workingWithWeek = week;
    }
  };

  isExpanded = (week) => {
    return (this.props.interfaceStore.workingWithWeek === week);
  };

  render(){

    const { week, index } = this.props;

    return (
      <ExpansionPanel expanded={this.isExpanded(week)} onChange={this.handleChangeWeek(week)}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Week {index + 1} - {week}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div className='gatelist-week'>
            <GatelistForm week={week} className='flex-row' />
            <GatelistList week={week} className='flex-row' />
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

export { GLWeekPanel };