import { ReactNode } from "react";
import styled from "styled-components";
import Navbar from "../navbar/navbar";

interface PageProps {
  children: ReactNode;
}

export const Page = ({ children }: PageProps) => {
  return (
    <PageWrapper>
      <PageNavbar>
        <Navbar />
      </PageNavbar>
      {children}
    </PageWrapper>
  );
};

export const PageContent = styled.main`
  margin: 1.2rem;
`;

const PageWrapper = styled.div`
  background: #fafafa;
  padding-bottom: 10rem;
  min-height: 100vh;
`;

const PageNavbar = styled.div`
  padding: 1rem 1rem 0 1rem;
`;
