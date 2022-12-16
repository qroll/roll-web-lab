import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import { COMBOBOX_LINKS } from "./data";

interface PageProps {
  children: React.ReactNode;
  header: string;
  description: string | React.ReactNode;
}

export function Page(props: PageProps) {
  const { header, description, children } = props;
  const router = useRouter();

  const index = COMBOBOX_LINKS.findIndex((link) => router.pathname.includes(link.link));
  const next = COMBOBOX_LINKS[index + 1];
  const prev = COMBOBOX_LINKS[index - 1];

  return (
    <PageContainer>
      <PageGrid>
        <Header>{header}</Header>
        {/* A11Y:
          - custom label as page has multiple nav sections
          - we can use the header to describe the nav section */}
        <Sidebar aria-labelledby="navigation">
          <h2 id="navigation">Combobox components</h2>
          <ul>
            {COMBOBOX_LINKS.map((link) => {
              return (
                <li key={link.link}>
                  <a href={link.link}>{link.label}</a>
                </li>
              );
            })}
          </ul>
          {prev && (
            <button
              onClick={() => {
                window.location.href = prev.link;
              }}
            >
              Prev: {prev.label}
            </button>
          )}
          {next && (
            <button
              onClick={() => {
                window.location.href = next.link;
              }}
            >
              Next: {next.label}
            </button>
          )}
        </Sidebar>
        <PageContent>
          {React.isValidElement(description) ? description : <p>{description}</p>}
          {/* A11Y: associate label with input */}
          <Label htmlFor="input-prev">Prev input</Label>
          <Input id="input-prev" />
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Perspiciatis, deleniti, aliquid nobis voluptas
            repellendus alias amet asperiores tenetur dolorum nisi quidem mollitia ab adipisci consequatur doloribus
            error soluta quaerat voluptatibus.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Perspiciatis, deleniti, aliquid nobis voluptas
            repellendus alias amet asperiores tenetur dolorum nisi quidem mollitia ab adipisci consequatur doloribus
            error soluta quaerat voluptatibus.
          </p>
          <AreaOfInterest>{children}</AreaOfInterest>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Perspiciatis, deleniti, aliquid nobis voluptas
            repellendus alias amet asperiores tenetur dolorum nisi quidem mollitia ab adipisci consequatur doloribus
            error soluta quaerat voluptatibus.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Perspiciatis, deleniti, aliquid nobis voluptas
            repellendus alias amet asperiores tenetur dolorum nisi quidem mollitia ab adipisci consequatur doloribus
            error soluta quaerat voluptatibus.
          </p>
          <Label htmlFor="input-next">Next input</Label>
          <Input id="input-next" />
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Perspiciatis, deleniti, aliquid nobis voluptas
            repellendus alias amet asperiores tenetur dolorum nisi quidem mollitia ab adipisci consequatur doloribus
            error soluta quaerat voluptatibus.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Perspiciatis, deleniti, aliquid nobis voluptas
            repellendus alias amet asperiores tenetur dolorum nisi quidem mollitia ab adipisci consequatur doloribus
            error soluta quaerat voluptatibus.
          </p>
        </PageContent>
      </PageGrid>
    </PageContainer>
  );
}

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  color: #121212;
  min-height: 100vh;
`;

const PageGrid = styled.div`
  display: grid;
  grid-template-areas:
    ". header ."
    "sidebar content .";
  grid-template-columns: 1fr min(100%, 500px) 1fr;
  align-items: start;
  justify-items: center;

  margin: 1rem;
  column-gap: 1rem;
  row-gap: 2rem;

  @media (max-width: 780px) {
    grid-template-areas:
      "header"
      "sidebar"
      "content";
    grid-template-columns: 1fr;
    align-items: start;
    justify-items: start;
  }
`;

const Header = styled.h1`
  grid-area: header;
  margin: 0;
`;

const Sidebar = styled.nav`
  grid-area: sidebar;
  justify-self: end;

  position: sticky;
  top: 1rem;

  @media (max-width: 780px) {
    position: relative;
    justify-self: start;
  }

  display: flex;
  flex-direction: column;
  align-items: flex-start;

  background: #fff;
  border-radius: 10px;
  box-shadow: rgba(100, 100, 100, 0.1) 0 0 4px 4px;
  padding: 1rem 1rem 2rem 1rem;
  margin-right: 2rem;

  ul {
    margin: 0;
    padding: 0 1rem;
  }

  li {
    padding: 0;
    margin: 0.5rem 0;
  }

  a {
    text-decoration: underline;
  }

  button {
    margin: 0.3rem 0;
  }

  button:first-of-type {
    margin-top: 1rem;
  }
`;

const PageContent = styled.main`
  grid-area: content;
  width: 100%;
`;

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
