import { useState } from "react";
import styled from "styled-components";

/*
 *
 * 1. does modal scroll if hidden behind keyboard on Android
 * 2. a better way to dismiss keyboard
 * 3. emulate device-fixed with visualviewport api
 *
 */

export default function ModalPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      {showModal && (
        <Modal>
          <ModalContent>
            <button onClick={() => setShowModal(false)}>Hide modal</button>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam eaque, tempora eius numquam inventore sed
              soluta repellendus! Temporibus dolores excepturi illo doloribus eos laborum possimus repudiandae,
              explicabo commodi minus nostrum.
            </p>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam eaque, tempora eius numquam inventore sed
              soluta repellendus! Temporibus dolores excepturi illo doloribus eos laborum possimus repudiandae,
              explicabo commodi minus nostrum.
            </p>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam eaque, tempora eius numquam inventore sed
              soluta repellendus! Temporibus dolores excepturi illo doloribus eos laborum possimus repudiandae,
              explicabo commodi minus nostrum.
            </p>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam eaque, tempora eius numquam inventore sed
              soluta repellendus! Temporibus dolores excepturi illo doloribus eos laborum possimus repudiandae,
              explicabo commodi minus nostrum.
            </p>
          </ModalContent>
        </Modal>
      )}
      <Content>
        <input />
        <button onClick={() => setShowModal(true)}>Show modal</button>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam eaque, tempora eius numquam inventore sed soluta
          repellendus! Temporibus dolores excepturi illo doloribus eos laborum possimus repudiandae, explicabo commodi
          minus nostrum.
        </p>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam eaque, tempora eius numquam inventore sed soluta
          repellendus! Temporibus dolores excepturi illo doloribus eos laborum possimus repudiandae, explicabo commodi
          minus nostrum.
        </p>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam eaque, tempora eius numquam inventore sed soluta
          repellendus! Temporibus dolores excepturi illo doloribus eos laborum possimus repudiandae, explicabo commodi
          minus nostrum.
        </p>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam eaque, tempora eius numquam inventore sed soluta
          repellendus! Temporibus dolores excepturi illo doloribus eos laborum possimus repudiandae, explicabo commodi
          minus nostrum.
        </p>
        <input />
        <button onClick={() => setShowModal(true)}>Show modal</button>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam eaque, tempora eius numquam inventore sed soluta
          repellendus! Temporibus dolores excepturi illo doloribus eos laborum possimus repudiandae, explicabo commodi
          minus nostrum.
        </p>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam eaque, tempora eius numquam inventore sed soluta
          repellendus! Temporibus dolores excepturi illo doloribus eos laborum possimus repudiandae, explicabo commodi
          minus nostrum.
        </p>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam eaque, tempora eius numquam inventore sed soluta
          repellendus! Temporibus dolores excepturi illo doloribus eos laborum possimus repudiandae, explicabo commodi
          minus nostrum.
        </p>
        <input />
        <button onClick={() => setShowModal(true)}>Show modal</button>
      </Content>
    </div>
  );
}

const Content = styled.div`
  padding: 1rem;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #0008;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  max-height: 80vh;
  background: #fff;
  margin: 1rem;
  padding: 1rem;
  overflow: auto;
`;
