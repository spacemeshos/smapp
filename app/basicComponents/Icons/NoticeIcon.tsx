import styled from 'styled-components';

export default styled.img.attrs(({ theme: { icons: { infoPopup } } }) => ({
  src: infoPopup,
}))`
  width: 10px;
  height: 20px;
  margin-right: 10px;
`;
