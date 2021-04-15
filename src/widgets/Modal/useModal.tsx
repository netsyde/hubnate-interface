import { useCallback, useContext } from "react";
import { Context } from "./ModalContext";
export type Handler = () => void;

const useModal = (modal: React.ReactNode): [Handler, Handler] => {
  const { onPresent, onDismiss } = useContext(Context);

  const onPresentCallback = useCallback(() => {
    onPresent(modal);
  }, [modal, onPresent]);

  return [onPresentCallback, onDismiss];
};

export default useModal;