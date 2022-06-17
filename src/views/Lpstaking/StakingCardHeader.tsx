import { useSelector, useDispatch } from "react-redux";
import cakeimg from "../../assets/tokens/CAKE.png";
import surfimg from "../../assets/tokens/SURF.png";
import { CoreTag } from '../../components/Tags';


import { Tag, Flex, Button } from '@pancakeswap/uikit';
import "./lpstaking.scss";



const StakingCardHeader = ({ }) => {

  return (
    <>
      <div className="lpstaking-header">
        <div className= "pair-img">
          <img className="first-token-img" src={cakeimg} alt="cake"/>
          <img className="second-token-img" src={surfimg} alt="surf"/>
        </div>
        <div>
          <div className="header-title1">
              CAKE-SURF
          </div>
          <Flex justifyContent="space-between">
              <CoreTag />
              <Tag variant="success">4X</Tag>
          </Flex>                               
        </div>
      </div>
      <div className="lpstaking-apr">
        <div className="lpstaking-apr-title">APR:</div>
        <div className="lpstaking-apr-title">30.51%</div>
      </div>
      <div className="lpstaking-apr">
        <div className="lpstaking-apr-title">EARN:</div>
        <div className="lpstaking-apr-title">CAKE + Fees</div>
      </div>
    </>
  )

}

export default StakingCardHeader;
