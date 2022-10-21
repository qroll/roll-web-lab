import React from "react";
import styled from "styled-components";

interface PageProps {
  children: React.ReactNode;
  header: string;
  description: string;
  next?: { link: string; label: string };
  prev?: { link: string; label: string };
}

export function Page(props: PageProps) {
  const { header, description, children, next, prev } = props;
  return (
    <PageContainer>
      <PageContent>
        <Header>{header}</Header>
        <p>{description}</p>
        <Label>Prev input</Label>
        <Input />
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
        <AreaOfInterest>{children}</AreaOfInterest>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Perspiciatis, deleniti, aliquid nobis voluptas
          repellendus alias amet asperiores tenetur dolorum nisi quidem mollitia ab adipisci consequatur doloribus error
          soluta quaerat voluptatibus.
        </p>
        <Label>Next input</Label>
        <Input />
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
        {prev && (
          <button
            onClick={() => {
              window.location.href = prev.link;
            }}
          >
            {prev.label}
          </button>
        )}
        {next && (
          <button
            onClick={() => {
              window.location.href = next.link;
            }}
          >
            {next.label}
          </button>
        )}
      </PageContent>
    </PageContainer>
  );
}

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #f5f5f5;
  color: #121212;
  min-height: 100vh;
`;

export const PageContent = styled.div`
  width: 400px;
  margin: 1rem auto;
`;

export const Header = styled.h1``;

const Label = styled.label`
  font-weight: bolder;
  display: block;
  margin: 0 0 1rem 0;
`;

const Input = styled.input`
  display: block;
`;

const AreaOfInterest = styled.div`
  background: #dceaf2;
  padding: 1rem;
  margin: 1rem -1rem;
`;
