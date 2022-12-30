import { PropsWithChildren, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
// Default props value.
const defaultReactPortalProps = {
  modalId: 'react-portal',
};
// Define ReactPortal props.
type ReactPortalProps = {
  modalId: string;
} & PropsWithChildren<any> &
  typeof defaultReactPortalProps;
// Render component.
export default function ({ children, modalId }: ReactPortalProps) {
  // Manage state of portal-wrapper.
  const [wrapper, setWrapper] = useState<Element | null>(null);

  useLayoutEffect(() => {
    // Find the container-element (if exist).
    let element = document.getElementById(modalId);
    // Bool flag whether container-element has been created.
    let created = false;
    if (!element) {
      created = true;
      const wrapper = document.createElement('div');
      wrapper.setAttribute('id', modalId);
      document.body.appendChild(wrapper);
      element = wrapper;
    }
    // Set wrapper state.
    setWrapper(element);
    // Cleanup effect.
    return () => {
      if (created && element?.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [modalId]);
  // Return null on initial rendering.
  if (wrapper === null) return null;
  // Return portal-wrapper component.
  return createPortal(children, wrapper);
}
