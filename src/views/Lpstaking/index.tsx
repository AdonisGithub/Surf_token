import React, {useState, useEffect} from "react";
import { Route, useRouteMatch, useLocation } from "react-router-dom";
import { Grid, Zoom } from "@material-ui/core";
import styled, { keyframes } from 'styled-components'
import { ExpandableSectionButton } from "../../components/ExpandableSectionButton";
import ActionCotainer from "./ActionCotainer";
import DetailsSection from './DetailsSection';
import StakingCardHeader from "./StakingCardHeader";
import {isAddress} from "../../helpers/isAddress"
import "./lpstaking.scss";
import { CardHeader } from "@pancakeswap/uikit";


const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  height: ${(props) => (props.expanded ? '100%' : '0px')};
  overflow: hidden;
`

function Lpstaking() {
    const [showExpandableSection, setShowExpandableSection] = useState(false);


    //*******************************referrer address*****************************//
    const { pathname, search } = useLocation();
    let referrer;
    useEffect(() => {
        if (search.slice(5) && isAddress(atob(search.slice(5)))) {
          referrer = atob(search.slice(5));
          console.log("referrer:", referrer);
        }
    }, [referrer]);


    return (
        <div className="lpstaking-card-wrapper">
            <Zoom  in={true}>
                <div className="lpstaking-card-content">
                    <StakingCardHeader/>
                    <ActionCotainer/>
                    <div className="divider"></div>
                    <ExpandableSectionButton
                        onClick={() => setShowExpandableSection(!showExpandableSection)}
                        expanded={showExpandableSection}
                    />
                    <ExpandingWrapper expanded={showExpandableSection}>
                        <DetailsSection
                            bscScanAddress={"https://testnet.bscscan.com/address/0x3D3c4eE5aAfFe1603a32fb468C9E9Ecb18221528"}
                            totalValueFormatted={"3213333121"}
                            addLiquidityUrl={"https://pancakeswap.info/pool/"}
                        />
                    </ExpandingWrapper>
                </div>
            </Zoom>
        </div>
    );
}

export default Lpstaking;
