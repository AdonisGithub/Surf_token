import React, { useState } from "react";
import { Button, Flex, Heading } from "@pancakeswap/uikit";
// import useToast from "../../hooks/useToast";
import "./lpstaking.scss";


const HarvestAction = () => {
  // const { toastSuccess, toastError } = useToast();
  const [pendingTx, setPendingTx] = useState(false);


  return (
    <div className="lpstaking-harvest">
        <div className="lpstaking-earned-value">0.0000</div>
        <Button
          disabled={pendingTx}
          variant="success" 
          onClick={async () => {
            setPendingTx(true);
            // try {
            //   console.log("harvest", toastSuccess);
            //   toastSuccess(
            //     `Harvested!`,
            //     "Your SLT earnings have been sent to your wallet!"
            //   );
            // } catch (e) {
            //   toastError(
            //     "Error",
            //     "Please try again. Confirm the transaction and make sure you are paying enough gas!"
            //   );
            //   console.error(e);
            // } finally {
            //   setPendingTx(false);
            // }
            
          }}
        >
          Harvest
        </Button>
    </div>
  );
};

export default HarvestAction;
