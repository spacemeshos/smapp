import React from 'react';
import styled from 'styled-components';
import { HashLink } from 'react-router-hash-link';
import { MainPath } from '../routerPaths';

const Wrapper = styled.div`
  position: relative;
`;

const Box = styled.div`
  position: absolute;
  top: -7px;
  right: 0;
  left: -150px;

  & a {
    color: ${({ theme }) => theme.colors.primary100};

    &:hover {
      text-decoration: none;
    }
  }
`;

export default () => (
  <Wrapper>
    <Box>
      <HashLink to={`${MainPath.Settings}#advanced`} smooth>
        Run a Quicksync?
      </HashLink>
    </Box>
  </Wrapper>
);
