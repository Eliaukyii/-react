import React, { Component, Fragment } from 'react';
import { Document, Page } from 'react-pdf';
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import { HeadTitle } from "./HeadTitle";
import Tips from "./TipsComp";
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

@observer
class FilePreviewDetail extends Component {
    @observable data = {
        file: '',
        title: '文件预览',
        isShowTips: false,
        tipsText: ''
    };
    state = {
        numPages: null,
        pageNumber: 1
    };

    componentDidMount = () => {
        let file = localStorage.getItem("fileUrl");
        if (file) {
            localStorage.removeItem("fileUrl");
            this.data.file = file;
        }
    };

    onDocumentLoadSuccess = (document) => {
        const { numPages } = document;
        this.setState({
            numPages,
            pageNumber: 1,
        });
    };

    changePage = offset => this.setState(prevState => ({
        pageNumber: prevState.pageNumber + offset,
    }));

    previousPage = () => {
        if (parseInt(this.state.pageNumber) - 1 > 0) {
            this.changePage(-1);
        } else {
            this.data.isShowTips = true;
            this.data.tipsText = '当前是第一页！';
            setTimeout(() => {
                this.data.isShowTips = false;
                this.data.tipsText = '';
            }, 1000);
        }
    };

    nextPage = () => {
        if (parseInt(this.state.pageNumber) + 1 <= parseInt(this.state.numPages)) {
            this.changePage(1);
        } else {
            this.data.isShowTips = true;
            this.data.tipsText = '当前是最后一页！';
            setTimeout(() => {
                this.data.isShowTips = false;
                this.data.tipsText = '';
            }, 1000);
        }
    }

    handleClickBack = () => {
        let backUrl = localStorage.getItem("backUrl");
        if (backUrl) {
            localStorage.removeItem("backUrl");
            window.location.href = backUrl;
        } else {
            this.props.history.go(-1);
        }
    };

    render() {
        const { numPages, pageNumber } = this.state;

        return (
            <div className="wrapper">
                <div className="wrapper-detail">
                    <Tips text={this.data.tipsText} isShow={this.data.isShowTips} />
                    <HeadTitle titleTxt={this.data.title} handleClickBack={this.handleClickBack} />
                    <div className="content_main">
                        <Document
                            file={this.data.file}
                            loading="努力加载中..."
                            noData="没有数据"
                            error="加载PDF文件失败"
                            renderMode="svg"
                            onLoadSuccess={this.onDocumentLoadSuccess}
                            onLoadError={(error) => console.log('PDF载入失败! ' + error.message)}
                            onSourceError={(error) => console.log('PDF数据源错误! ' + error.message)}
                        >
                            <Page pageNumber={pageNumber} />
                        </Document>
                    </div>
                </div>
                <div className='submitBox'>
                    <div className="pageEnd">
                        第 {pageNumber || (numPages ? 1 : '--')} 至 {numPages || '--'}页
                    </div>
                    <input type="text" name="audit" className="submitBtn btn-marginR"
                        value="上一页" readOnly={true}
                        onClick={this.previousPage}
                    />
                    <input type="text" className="submitBtn"
                        value="下一页" readOnly={true}
                        onClick={this.nextPage}
                    />
                </div>
                <style>{`
                    .submitBox{
                        display: -webkit-flex;
                        display: flex;
                        width:100%;
                        height: 0.88rem;
                        position: relative;
                        border-shadow: 0 -0.05rem 0.05rem #cdcdcd;
                        -moz-box-shadow: 0 -0.05rem 0.05rem #cdcdcd;
                        -webkit-box-shadow: 0 -0.05rem 0.05rem #cdcdcd;
                        align-items: center;
                        justify-content: center;
                        line-height: 0.88rem;
                        border-top: 1px solid #cdcdcd;
                        padding: 0 0.28rem;
                    }
                    .submitBtn{
                        position: relative;
                        text-align: center;
                        background:#197efe;
                        border: none;
                        outline: none;
                        color:#fff;
                        width: 90%;
                        font-size: 0.28rem;
                        height: 0.6rem;
                    }
                    .btn-marginR{
                        margin-right: 0.28rem;
                    }
                    .pageEnd{
                        position: relation;
                        bottom:0;
                        width:100%;
                        text-align: center;
                        color:#197efe;
                    }
                `}</style>
            </div>
        );
    }
}
export default FilePreviewDetail;