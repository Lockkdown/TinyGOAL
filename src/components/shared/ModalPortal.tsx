import React from 'react'
import { createPortal } from 'react-dom'

type ModalPortalProps = {
  children: React.ReactNode
}

export const ModalPortal: React.FC<ModalPortalProps> = ({ children }) =>
  createPortal(children, document.body)

export default ModalPortal
