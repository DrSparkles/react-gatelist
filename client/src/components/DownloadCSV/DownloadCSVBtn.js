import React from 'react';
import {inject, observer} from "mobx-react";
import downloadCsv from 'download-csv';

@inject()
@observer
export class DownloadCSVBtn extends React.Component {

  downloadData = this.props.downloadData;

  handleDownloadBtnClick = () => {
    console.log('DOWNLOAD CSV');
  };

  render() {

    return(
      <div className='download-csv-btn'>

        <button onClick={this.handleDownloadBtnClick}>Download CSV</button>

      </div>
    );
  };
}