import React, { createContext, useState } from "react";
import { Shadow, Fade } from '@src/types'
export type Handler = () => void;

interface ModalsContext {
  onPresent: (node: React.ReactNode, key?: string) => void;
  onDismiss: Handler;
}

export const Context = createContext<ModalsContext>({
  onPresent: () => null,
  onDismiss: () => null
});

const ModalProvider: React.FC = ({ children }) => {
    type ModalState = boolean | 'initial'
    const [openModal, setOpenModal] = useState<ModalState>('initial');
    const [fade, setFade] = useState<Fade>('')
    const [shadow, setShadow] = useState<Shadow>('')
    const [modalNode, setModalNode] = useState<React.ReactNode>();

    const calcFade = (donateModalState: ModalState) => {
        switch (donateModalState) {
            case 'initial': return '';
            case true: return 'fadeIn';
            case false: return 'fadeOut';
        }
    }

    const handlePresent = (node: React.ReactNode) => {
        setModalNode(node);
        console.log('open modal')
        setFade(calcFade(true))
        setShadow(calcShadow(true))
        
        setOpenModal(true)
    }

    const handleDismiss = () => {
        setFade(calcFade(false))
        setShadow(calcShadow(false))
        setTimeout(() => {
            setOpenModal(false);
            setModalNode(undefined);
        }, 1000)
    }

    const calcShadow = (donateModalState: ModalState) => {
        switch (donateModalState) {
            case 'initial': return '';
            case true: return 'container-shadow';
            case false: return 'container-shadowOut';
        }
    }

  return (
    <Context.Provider
      value={{
        onPresent: handlePresent,
        onDismiss: handleDismiss
      }}
    >
      {openModal == true ?
        <div className = {`donate-modal-wrapper ${shadow}`} onClick = {openModal === true ? () => handleDismiss() : null}>
            {React.isValidElement(modalNode) &&
            React.cloneElement(modalNode, {
              onDismiss: handleDismiss,
              fade: fade
            })}
        </div> : null
    }
    {children}
    </Context.Provider>
  );
};

export default ModalProvider;