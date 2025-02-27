import Modal from 'react-modal';

import styles from './styles.module.scss';
import { FC } from 'react';
import { JSX } from '@emotion/react/jsx-runtime';
import { CloseIcon } from '@/components/Icon/CloseIcon';

interface CommonModalProps {
    isOpen: boolean;
    closeModal: () => void;
    elem: JSX.Element;
}

export const CommonModal: FC<CommonModalProps> = ({
    isOpen,
    closeModal,
    elem,
}: CommonModalProps) => {
    return (
        <div className={isOpen ? styles.slideIn : styles.SlideWait}>
            <Modal
                isOpen={isOpen}
                onRequestClose={closeModal}
                className={`${styles.modal}${' '}${''}`}
                overlayClassName={styles.overlay}
            >
                {/* <button onClick={closeModal} className={styles.modalClose} type="button">
                    <CloseIcon/>
                </button> */}
                <div className="modal-content">{elem}</div>
            </Modal>
        </div>
    );
};
