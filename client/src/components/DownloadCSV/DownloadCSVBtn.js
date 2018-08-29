import React from 'react';
import {inject, observer} from "mobx-react";
import downloadCsv from 'download-csv';
import moment from "moment";

@inject()
@observer
export class DownloadCSVBtn extends React.Component {

  filename = this.props.fileName;
  headerData = this.props.headerData;
  downloadData = this.props.downloadData;
  dataFilter = this.props.dataFilter;

  csvData = [];

  processDataForDownload = () => {
    if (this.dataFilter !== undefined){
      this.csvData = this.downloadData.map(this.dataFilter);
    }
    else {
      this.csvData = this.downloadData;
    }
  };

  handleDownloadBtnClick = () => {
    this.processDataForDownload();
    const dateForFilename = moment().format('YYYY-MM-DD-HH:mm:ss');
    const fileName = this.filename + '-' + dateForFilename + '.csv';
    downloadCsv(this.csvData, this.headerData, fileName);
  };

  render() {
    console.log('downloadData', this.downloadData);
    return(
      <div className='download-csv-btn'>

        <button onClick={this.handleDownloadBtnClick} className='btn'>Download CSV</button>

      </div>
    );
  };
}