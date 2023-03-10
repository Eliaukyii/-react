import React from 'react'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import { ContentHead, HeadTitle } from "../commonComp/HeadTitle";
import { SubmitBtn } from "../commonComp/SubmitBtnComp";
import axios from "axios";
import { ContentInputs } from "../commonComp/InputComp";
import URL from "../../../public/api/serverAPI.config";
import Tips from "../commonComp/TipsComp";
import { PreApplicatFilter, PreAttnFilter, PreDeptFilter, PreItemFilter } from "../commonComp/EditCommonFilter";
import { CommonConfig } from "../config/commonConfig";
import { getDept, getEmployee, getItem, getUploadFile } from "../commonInterface/DeclareComm";
import DatePicker from "react-mobile-datepicker";
import moment from "moment";
import { AlterTips } from "../../page/commonComp/AlterTips";
import { getMoneyNumber, uuid } from "../config/commonCheck";
import { AddOtherProgressBar, AddProgressBar } from "../commonComp/ProgressBar";
import BaseComm from "../commonInterface/BaseComm";

@observer
class PayBorrowAdd extends React.Component {
    @observable data = {
        userid: '',
        type: 'AddAnysingleCY',
        Name: '',
        Dept: '',
        Year: '',
        pfi_id: '',
        params: {
            BankAccountName:'',
            BankAccount:'',
            BankName:'',
            BankID:'',
            Anyreason: '',
            ItemID: '',
            Item: '',
            Applicant: '',
            ApplicantID: '',
            ApplicantBuMenID: '',
            Anyperson: '',
            AnypersonID: '',
            AnyBuMenID: '',
            Unit: '',
            wandeihidden: '',
            Attn: '',
            AttnId: '',
            AttnBumenID: '',
            Money_1: '0.00',
            BankAccName: '',
            BankAccID: '',
            YearDate: '',
            Enclosure: '0',
            Othernote: '',
            deptKey: '',
            managersKey: '',
            attnKey: '',
            useKey: ''
        },
        payExpenseAdd: [],
        page: 1,
        isShowFilter: false,
        tipsText: '',
        isShowTips: false,
        addDeptList: [],
        addApplicatList: [],
        addAttnList: [],
        addUseList: [],
        isDeptShow: false,
        isEmployeeShow: false,
        isUseShow: false,
        deptClassName: '',
        managersClassName: '',
        rbpersonClassName: '',
        useClassName: '',
        epCurrent: 'Dept',
        danweiID: '',
        confirmText: '',
        timeParams: {
            max: '',
            min: '',
            isOpen: false
        },
        isShowToast: false,
        fileArr: []
    };
    @observable dateConfig = {
        'year': {
            format: 'YYYY',
            caption: 'Year',
            step: 1,
        },
        'month': {
            format: 'MM',
            caption: 'Mon',
            step: 1,
        },
        'date': {
            format: 'DD',
            caption: 'Day',
            step: 1,
        }
    };
    constructor(props) {
        super(props);
        this.state = {
            overflow: 'scroll'
        };
    }

    componentDidMount = async () => {
        let id = BaseComm.GetLoginInfo().userOrgID;
        let name = BaseComm.GetLoginInfo().userName;
        this.data.userid = BaseComm.GetLoginID();
        let dept = [];
        dept = await getDept(this.data.userid, id);
        if (dept.data) {
            this.data.params.wandeihidden = dept.data[0].DeptCode;
            this.data.params.Unit = dept.data[0].DeptName;
        }
        this.data.params.ApplicantBuMenID = id;
        this.data.params.Applicant = name;
        this.data.params.ApplicantID = this.data.userid;
        let year = new Date().getFullYear();
        let month = new Date().getMonth() + 1;
        let day = new Date().getDate();
        this.data.params.YearDate = year + '-' + month + "-" + day;
        //let params = JSON.parse(sessionStorage.getItem("params"));
        //if (params) {
        //    this.data.params = params;
        //} else {
        let code = this.props.location.search;
        code = code.slice(1);
        if (code.indexOf("&") != -1) {
            code = code.split('&')[0];
        }
        if (code && code.indexOf('.') < 0) {
            sessionStorage.setItem("pfi_id", code);
            this.getDetail(code);
        } else {
            sessionStorage.setItem("pfi_id", "");
        }
        //}
    };

    //??????????????????
    getDetail = (PFI_ID) => {
        axios({
            url: URL.histBorrow,
            params: {
                type: 'GetAnysingleCY',
                userid: this.data.userid,
                json: {
                    PFI_ID: PFI_ID
                }
            },
            method: 'post'
        }).then(res => {
            if (res.data.Money_1 != "") {
                this.data.params.Applicant = res.data.Applicant;
                this.data.params.ApplicantID = res.data.ApplicantID;
                this.data.params.wandeihidden = res.data.wandeihidden;
                this.data.params.AnypersonID = res.data.AnypersonID;
                this.data.params.AttnId = res.data.AttnId;
                this.data.params.Attn = res.data.Attn;
                this.data.params.Unit = res.data.Unit;
                this.data.params.AttnBumenID = res.data.AttnBumenID;
                this.data.params.Money_1 = res.data.Money_1;
                this.data.params.BankAccID = res.data.BankAccID;
                this.data.params.BankAccName = res.data.BankAccName;
                this.data.params.YearDate = res.data.YearDate;
                this.data.params.Enclosure = res.data.Enclosure;
                this.data.params.ApplicantBuMenID = res.data.ApplicantBuMenID;
                this.data.params.AnyBuMenID = res.data.AnyBuMenID;
                this.data.params.Othernote = res.data.Othernote;
                this.data.params.Anyreason = res.data.Anyreason;
                // ??????????????????????????????????????????
                this.data.params.BankAccountName = res.data.BankAccountName;
                this.data.params.BankAccount = res.data.BankAccount;
                this.data.params.BankName = res.data.BankName;
                this.data.params.BankID = res.data.BankID;
                
                this.data.params.Anyperson = res.data.Anyperson;
                this.data.params.ItemID = res.data.ItemID;
                if (this.data.params.ItemID) {
                    getItem(this.data.userid, this.data.params.wandeihidden, null, this.data.params.YearDate.slice(0, 4)).then(res => {
                        if (res.status === '00') {
                            for (let i = 0; res.data.length > i; i++) {
                                if (res.data[i].ItemID === this.data.params.ItemID) {
                                    this.data.params.Item = res.data[i].ItemName;
                                }
                            }
                        } else {
                            this.data.isShowTips = true;
                            this.data.tipsText = `${res.msg}???????????????????????????`;
                            setTimeout(() => {
                                this.data.isShowTips = false;
                                this.data.tipsText = '';
                            }, 1000);
                        }
                    });
                }
            }
        }).catch(reason => {
            console.log(reason);
        });
    };

    handleClickBack = () => {
        window.location.href = '/home/payBorrowList?4';
    };

    handleChangeInput = async (e) => {
        const name = e.target.name;
        let valueC = e.target.value;
        if (name === 'deptKey') {
            this.data.addDeptList = await getDept(this.data.userid, this.data.params.deptKey);
        }
        if (name === 'applicatKey') {
            this.data.addApplicatList = await getEmployee(this.data.userid, this.data.params.applicatKey);
        }
        if (name === 'attnKey') {
            this.data.addAttnList = await getEmployee(this.data.userid, this.data.params.attnKey);
        }
        if (name === 'useKey') {
            this.data.addUseList = await getItem(this.data.userid, this.data.params.danweiID, this.data.params.useKey);
        }
        this.data.params[name] = valueC;
    };

    handleBlurMoney = (e) => {
        const name = e.target.name;
        if (!this.data.params[name]) {
            this.data.params[name] = '0.00';
        }
        if (name === 'Money_1') {
            this.data.params[name] = getMoneyNumber(this.data.params[name]);
        }
    };

    handleFocusMoney = (e) => {
        let name = '';
        name = e.target.name;
        if (name === 'Money_1') {
            this.data.params[name] = '';
        }
    };

    handleClickCover = () => {
        const isShowFilter = this.data.isShowFilter;
        if (isShowFilter) {
            this.data.isDeptShow = false;
            this.data.deptClassName = CommonConfig.closed;
            this.data.params.deptKey = '';
            this.data.isEmployeeShow = false;
            this.data.managersClassName = CommonConfig.closed;
            this.data.rbpersonClassName = CommonConfig.closed;
            this.data.isUseShow = false;
            this.data.useClassName = CommonConfig.closed;
            this.data.isShowToast = false;
            this.data.isShowFilter = false;
            this.setState({
                overflow: 'scroll'
            });
        }
    };

    handleClickFilter = async (e) => {
        const name = e.target.name;
        if (name === 'Unit') {
            this.data.addDeptList = await getDept(this.data.userid);
            if (!this.data.isDeptShow) {
                this.data.isShowFilter = true;
                this.data.deptClassName = CommonConfig.opened;
            }
        }
        if (name === 'Attn') {
            this.data.addDeptList = await getDept(this.data.userid);
            if (!this.data.isDeptShow) {
                this.data.isShowFilter = true;
                this.data.deptClassName = CommonConfig.opened;
                this.data.epCurrent = 'Attn';
            }
        }
        if (name === 'Anyperson') {
            this.data.addDeptList = await getDept(this.data.userid);
            if (!this.data.isDeptShow) {
                this.data.isShowFilter = true;
                this.data.deptClassName = CommonConfig.opened;
                this.data.epCurrent = 'Anyperson';
            }
        }
        if (name === 'Item') {
            if (this.data.params.wandeihidden) {
                this.data.addUseList = await getItem(this.data.userid, this.data.params.wandeihidden);
                if (!this.data.isUseShow) {
                    this.data.isShowFilter = true;
                    this.data.useClassName = CommonConfig.opened;
                }
            } else {
                this.data.isShowTips = true;
                this.data.tipsText = '???????????????????????????';
                setTimeout(() => {
                    this.data.isShowTips = false;
                    this.data.tipsText = '';
                }, 1000);
            }
        }
    };

    handleClickClear = async (e) => {
        const name = e.target.id;
        if (name === 'deptKey') {
            this.data.params.deptKey = '';
            this.data.addDeptList = await getDept(this.data.userid);
        }
        if (name === 'applicatKey') {
            this.data.params.applicatKey = '';
            this.data.addApplicatList = await getEmployee(this.data.userid);
        }
        if (name === 'attnKey') {
            this.data.params.attnKey = '';
            this.data.addAttnList = await getEmployee(this.data.userid);
        }
        if (name === 'useKey') {
            this.data.params.useKey = '';
            this.data.addUseList = await getItem(this.data.userid, this.data.params.wandeihidden);
        }
    };

    handleChooseDept = async (e) => {
        if (this.data.epCurrent === 'Attn') {
            this.data.danweiID = e.target.id;
            this.data.deptClassName = CommonConfig.closed;
            this.data.addApplicatList = await getEmployee(this.data.userid, this.data.danweiID);
            this.data.managersClassName = CommonConfig.opened;
        } if (this.data.epCurrent === 'Anyperson') {
            this.data.danweiID = e.target.id;
            this.data.deptClassName = CommonConfig.closed;
            this.data.addAttnList = await getEmployee(this.data.userid, this.data.danweiID);
            this.data.rbpersonClassName = CommonConfig.opened;
        }
        if (this.data.epCurrent === 'Dept') {
            this.data.params.wandeihidden = e.target.id;
            this.data.params.Unit = e.target.innerText;
            this.data.deptClassName = CommonConfig.closed;
            this.data.isShowFilter = false;
        }
    };

    handleChooseManagers = (e) => {
        this.data.params.AttnId = e.target.id;
        this.data.params.Attn = e.target.innerText;
        this.data.params.AttnBumenID = e.target.title;
        this.data.managersClassName = CommonConfig.closed;
        this.data.isShowFilter = false;
        this.data.epCurrent = 'Dept';
    };

    handleChooseAttn = (e) => {
        this.data.params.AnypersonID = e.target.id;
        this.data.params.Anyperson = e.target.innerText;
        this.data.params.AnyBuMenID = e.target.title;
        this.data.rbpersonClassName = CommonConfig.closed;
        this.data.isShowFilter = false;
        this.data.epCurrent = 'Dept';
    };

    handleChooseUse = (e) => {
        this.data.params.ItemID = e.target.id;
        this.data.params.Item = e.target.innerText;
        this.data.useClassName = CommonConfig.closed;
        this.data.isShowFilter = false;
    };
    //????????????
    handleClickDate = () => {
        this.data.timeParams.isOpen = true;
        this.data.timeParams.max = new Date();
    };

    handleSelectDate = (date) => {
        this.data.timeParams.isOpen = false;
        this.data.params.YearDate = moment(date).format('YYYY-MM-DD');
    };

    handleCancelDate = () => {
        this.data.timeParams.isOpen = false;
    };


    handleNextStep = () => {
        if (parseFloat(this.data.params.Money_1) <= 0.00) {
            this.data.isShowTips = true;
            this.data.tipsText = "??????????????????0????????????";
            setTimeout(() => {
                this.data.isShowTips = false;
                this.data.tipsText = '';
                this.data.isShowFilter = false;
            }, 1000);
            return;
        }
        if (!this.data.params.Anyreason) {
            this.data.isShowTips = true;
            this.data.tipsText = "????????????????????????";
            setTimeout(() => {
                this.data.isShowTips = false;
                this.data.tipsText = '';
            }, 1000);
            return;
        }
        if (!this.data.params.Item) {
            this.data.isShowTips = true;
            this.data.tipsText = "????????????????????????";
            setTimeout(() => {
                this.data.isShowTips = false;
                this.data.tipsText = '';
            }, 1000);
            return;
        }
        if (!this.data.params.BankAccountName) {
            this.data.isShowTips = true;
            this.data.tipsText = "??????????????????";
            setTimeout(() => {
                this.data.isShowTips = false;
                this.data.tipsText = '';
            }, 1000);
            return;
        }
        if (!this.data.params.BankAccount) {
            this.data.isShowTips = true;
            this.data.tipsText = "????????????(???)??????";
            setTimeout(() => {
                this.data.isShowTips = false;
                this.data.tipsText = '';
            }, 1000);
            return;
        }
        if (!this.data.params.BankName) {
            this.data.isShowTips = true;
            this.data.tipsText = "?????????????????????";
            setTimeout(() => {
                this.data.isShowTips = false;
                this.data.tipsText = '';
            }, 1000);
            return;
        }
        if (!this.data.params.BankID) {
            this.data.isShowTips = true;
            this.data.tipsText = "??????????????????";
            setTimeout(() => {
                this.data.isShowTips = false;
                this.data.tipsText = '';
            }, 1000);
            return;
        }
        if (this.data.params.Money_1 && this.data.params.Anyreason && this.data.params.BankAccountName && this.data.params.BankAccount && this.data.params.BankName && this.data.params.BankID && this.data.params.Unit
            && this.data.params.Item && this.data.params.YearDate) {
            sessionStorage.setItem("params", JSON.stringify(this.data.params));
            window.location.href = '/home/addBorrowTwo';
        } else {
            this.data.isShowTips = true;
            this.data.tipsText = "????????????????????????";
            setTimeout(() => {
                this.data.isShowTips = false;
                this.data.tipsText = '';
            }, 1000);
        }
    };

    render() {
        return (
            <div className="wrapper">
                <div className="wrapper-detail colorAddBG">
                    <Tips text={this.data.tipsText} isShow={this.data.isShowTips} />
                    <div id="list-filter" className="list-filter" onClick={this.handleClickCover}
                        style={{ display: this.data.isShowFilter ? 'block' : 'none' }}>
                    </div>
                    <DatePicker theme='ios'
                        showHeader={false}
                        confirmText={this.data.confirmText || "??????"}
                        dateConfig={this.dateConfig}
                        value={new Date()}
                        max={this.data.timeParams.max ? this.data.timeParams.max : (new Date())}
                        isOpen={this.data.timeParams.isOpen}
                        onSelect={(date) => this.handleSelectDate(date)}
                        onCancel={this.handleCancelDate}
                    />
                    <PreDeptFilter filterClassName={this.data.deptClassName}
                        addPreList={this.data.addDeptList.data || []} name="deptKey"
                        handleChangeInput={this.handleChangeInput}
                        deptKey={this.data.params.deptKey}
                        handleChooseFilter={this.handleChooseDept}
                        handleClickClear={this.handleClickClear} />
                    <PreApplicatFilter filterClassName={this.data.managersClassName}
                        addPreList={this.data.addApplicatList.data || []} name="managersKey"
                        handleChangeInput={this.handleChangeInput}
                        managersKey={this.data.params.managersKey}
                        handleChooseFilter={this.handleChooseManagers}
                        handleClickClear={this.handleClickClear} />
                    <PreAttnFilter filterClassName={this.data.rbpersonClassName}
                        addPreList={this.data.addAttnList.data || []} name="attnKey"
                        handleChangeInput={this.handleChangeInput}
                        attnKey={this.data.params.attnKey}
                        handleChooseFilter={this.handleChooseAttn}
                        handleClickClear={this.handleClickClear} />
                    <PreItemFilter filterClassName={this.data.useClassName}
                        addPreList={this.data.addUseList.data || []} name="useKey"
                        handleChangeInput={this.handleChangeInput}
                        itemKey={this.data.params.useKey}
                        handleChooseFilter={this.handleChooseUse}
                        handleClickClear={this.handleClickClear} />
                    <HeadTitle titleTxt="????????????" handleClickBack={this.handleClickBack} />
                    <AddOtherProgressBar oneTit='????????????' twoTit='????????????' threeTit='????????????' fourTit='????????????'
                        onClickTwo={this.handleNextStep} />
                    <div className="content_main list-bomPad">
                        <ContentInputs name="YearDate" display="none" readOnly={true}
                            title="????????????" type="text" placeholder="?????????"
                            value={this.data.params.YearDate} />
                        <ContentInputs name="Unit" display="none" readOnly={true}
                            title="????????????" type="text" placeholder="?????????"
                            value={this.data.params.Unit} iconName="iconfont icon-xiangyou icon-select"
                            handleClick={this.handleClickFilter} />
                        <ContentInputs name="Anyreason" display="block"
                            title="????????????" type="text" placeholder="?????????"
                            value={this.data.params.Anyreason}
                            handleChange={this.handleChangeInput} />
                        <ContentInputs name="Item" display="block" readOnly={true}
                            title="????????????" type="text" placeholder="?????????"
                            value={this.data.params.Item} iconName="iconfont icon-xiangyou icon-select"
                            handleClick={this.handleClickFilter} />
                        <ContentInputs name="Money_1" display="block" iconName="icon-select" price="???"
                            title="?????????" type="text" placeholder="?????????"
                            handleBlur={this.handleBlurMoney} handleFocus={this.handleFocusMoney}
                            value={this.data.params.Money_1}
                            handleChange={this.handleChangeInput} />
                        {/* ?????? */}
                        <ContentInputs name="BankAccountName" display="block"
                            title="??????" type="text" placeholder="?????????"
                            value={this.data.params.BankAccountName} 
                            handleChange={this.handleChangeInput}/>
                            
                        <ContentInputs name="BankAccount" display="block"
                            title="???(???)???" type="text" placeholder="?????????"
                            value={this.data.params.BankAccount} 
                            handleChange={this.handleChangeInput} />

                        <ContentInputs name="BankName" display="block"
                            title="?????????" type="text" placeholder="?????????"
                            value={this.data.params.BankName} 
                            handleChange={this.handleChangeInput} />

                        <ContentInputs name="BankID" display="block"
                            title="??????" type="text" placeholder="?????????"
                            value={this.data.params.BankID} 
                            handleChange={this.handleChangeInput} />

                        <ContentInputs name="Othernote" display="none" borderBot={true}
                            title="????????????" type="text" placeholder="?????????"
                            value={this.data.params.Othernote}
                            handleChange={this.handleChangeInput} />
                    </div>
                </div>
                <SubmitBtn value="?????????" handleClick={this.handleNextStep} />
                <style>{`
                    body{
                        overflow-y:${this.state.overflow};
                    }
                    .main_closed{
                        height:0
                        overflow:hidden;
                    }
                    .main_opened{
                        height:auto;
                        overflow:initial;
                    }
                `}</style>
            </div>
        )
    }
}
export default PayBorrowAdd;