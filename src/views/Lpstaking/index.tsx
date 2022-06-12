import { Grid, Zoom } from "@material-ui/core";
import { Tag, Flex, Heading } from '@pancakeswap/uikit';
import { CoreTag } from '../../components/Tags';


import "./lpstaking.scss";

import cakeimg from "../../assets/tokens/CAKE.png";
import surfimg from "../../assets/tokens/SURF.png";


function Lpstaking() {

    return (
        <div className="lpstaking-card-wrapper">
            <Zoom  in={true}>
                <div className="lpstaking-card-content">
                    <div className="lpstaking-header">
                        <div className= "pair-img">
                            <img className="first-token-img" src={cakeimg} alt="cake"/>
                            <img className="second-token-img" src={surfimg} alt="surf"/>
                        </div>
                        <div>
                            <div className="header-title1">
                                CAKE-SURF
                            </div>
                            <Flex justifyContent="center">
                                <CoreTag />
                            </Flex>
                        </div>
                    </div>
                </div>
            </Zoom>
        </div>
    );
}

export default Lpstaking;
