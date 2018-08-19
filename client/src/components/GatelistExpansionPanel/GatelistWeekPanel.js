import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import './style.css';

import { GatelistForm } from '../GatelistForm';
import {GatelistList} from "../GatelistList";

class GLWeekPanel extends React.Component {

  render(){

    const { week, index } = this.props;

    return (
      <ExpansionPanel>
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