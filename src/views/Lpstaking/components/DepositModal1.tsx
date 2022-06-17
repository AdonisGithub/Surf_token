import BigNumber from 'bignumber.js'
import React, {useCallback, useMemo, useState } from 'react'
import { ModalActions, ModalInput } from 'src/components/Modal'
import { getFullDisplayBalance } from 'src/helpers/formatBalance'
import { Button, LinkExternal } from '@pancakeswap/uikit'
import Fade from '@material-ui/core/Fade';
import { Modal} from "@material-ui/core";
import Backdrop from '@material-ui/core/Backdrop';

import "./modal.scss";
interface DepositModalProps {
  max: BigNumber
  onConfirm: (amount: string) => void
  tokenName?: string
  addLiquidityUrl?: string
}

export const DepositModal1: React.FC<DepositModalProps> = ({ max, onConfirm, tokenName = '', addLiquidityUrl }) => {
  const [isOpen1, setIsOpen1] = useState(false);
  const closeModal = () => { setIsOpen1(false)}
  const openModal = () => {setIsOpen1(true)}
  
  const [val, setVal] = useState('')
  const [pendingTx, setPendingTx] = useState(false)

  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max, 18, 15)
  }, [max])

  const valNumber = new BigNumber(val)
  const fullBalanceNumber = new BigNumber(fullBalance)

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        setVal(e.currentTarget.value.replace(/,/g, '.'))
      }
    },
    [setVal],
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  return (
    <div>
      <Button variant="success" onClick={openModal}> 
        Stake LP
      </Button>
      <Modal
        className="modal"         
        open={isOpen1} 
        onClose={closeModal}  
        aria-labelledby="modal-modal-title" 
        aria-describedby="modal-modal-description" 
        disableScrollLock={false}
        BackdropComponent={Backdrop}
        closeAfterTransition
        BackdropProps={{
            timeout: 800,
        }}
      >
        <Fade in={isOpen1}>
          <div className='modal-content'>  
            <ModalInput
              value={val}
              onSelectMax={handleSelectMax}
              onChange={handleChange}
              max={fullBalance}
              symbol={tokenName}
              addLiquidityUrl={addLiquidityUrl}
              inputTitle= "SURF-BNB LP STAKE"
            /> 
              <ModalActions>
                <Button variant="secondary"  width="100%" onClick={closeModal} disabled={pendingTx}>
                  Cancel
                </Button>
                <Button
                  width="100%"
                  disabled={pendingTx || !valNumber.isFinite() || valNumber.eq(0) || valNumber.gt(fullBalanceNumber)}
                  onClick={async () => {
                    setPendingTx(true)
                    try {
                      await onConfirm(val)
                    } catch (e) {
                      console.error(e)
                    } finally {
                      setPendingTx(false)
                    }
                  }}
                >
                  {pendingTx ? 'Pending Confirmation' : 'Confirm'}
                </Button>
              </ModalActions>
              <LinkExternal href={addLiquidityUrl} style={{ alignSelf: 'center' }}>
                {tokenName}
              </LinkExternal>
          </div>
        </Fade>
      </Modal>
    </div>
  )
}
