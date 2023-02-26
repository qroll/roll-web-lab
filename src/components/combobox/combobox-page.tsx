import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import { Page, PageContent } from "../common/page";
import { Type } from "../typography/type";
import { COMBOBOX_LINKS } from "./data";

interface PageProps {
  children: React.ReactNode;
  header: string;
  description: string | React.ReactNode;
}

export function ComboboxPage(props: PageProps) {
  const { header, description, children } = props;
  const router = useRouter();

  const index = COMBOBOX_LINKS.findIndex((link) => router.pathname.includes(link.link));
  const next = COMBOBOX_LINKS[index + 1];
  const prev = COMBOBOX_LINKS[index - 1];

  return (
    <Page>
      <PageContent>
        <PageGrid>
          <Header bold size="h800">
            {header}
          </Header>
          {/* A11Y:
          - custom label as page has multiple nav sections
          - we can use the header to describe the nav section */}
          <Sidebar aria-labelledby="navigation">
            <Type.H2 size="h300" semibold m="m" id="navigation">
              Combobox components
            </Type.H2>
            <ul>
              {COMBOBOX_LINKS.map((link, i) => {
                return (
                  <li key={link.link}>
                    <SidebarLink href={link.link} active={i === index}>
                      {link.label}
                    </SidebarLink>
                  </li>
                );
              })}
            </ul>
            {/* {prev && (
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
            )} */}
          </Sidebar>
          <Form>
            {React.isValidElement(description) ? description : <Type.Text mb="m">{description}</Type.Text>}
            {/* A11Y: associate label with input */}
            <Label htmlFor="input-prev">Prev input</Label>
            <Input id="input-prev" />
            <AreaOfInterest>{children}</AreaOfInterest>
            <Label htmlFor="input-next">Next input</Label>
            <Input id="input-next" readOnly />
          </Form>
        </PageGrid>
      </PageContent>
    </Page>
  );
}

const PageGrid = styled.div`
  display: grid;
  grid-template-areas:
    ". header ."
    "sidebar content .";
  grid-template-columns: 1fr min(100%, 700px) 1fr;
  align-items: start;
  justify-items: start;

  margin: 1rem;
  column-gap: 1rem;
  row-gap: 2rem;

  @media (max-width: 1400px) {
    grid-template-areas:
      ". header"
      "sidebar content";
    grid-template-columns: max(33%, 350px) 1fr;
    align-items: start;
    justify-items: start;
  }

  @media (max-width: 1000px) {
    grid-template-areas:
      "header"
      "sidebar"
      "content";
    grid-template-columns: 1fr;
    align-items: start;
    justify-items: start;
  }
`;

const Header = styled(Type.H1)`
  grid-area: header;
  margin: 0;
`;

const Sidebar = styled.nav`
  grid-area: sidebar;
  justify-self: end;

  position: sticky;
  top: 2rem;

  @media (max-width: 1000px) {
    position: relative;
    top: 0;
    justify-self: start;
  }

  display: flex;
  flex-direction: column;
  align-items: flex-start;

  background: #fff;
  border-radius: 10px;
  box-shadow: rgba(100, 100, 100, 0.1) 0 0 4px 4px;
  margin-right: 2rem;

  ul {
    margin: 0;
    list-style: none;
  }

  li {
    border-top: 1px solid #eee;

    &:last-child {
      border-bottom: 1px solid #eee;
    }
  }
`;

export const SidebarLink = styled.a<{ active: boolean }>`
  padding: 1rem;
  width: 100%;
  display: block;

  ${(props) =>
    props.active &&
    `
    color: #555;
    pointer-events: none;
    cursor: default;
    text-decoration: none;
    border-left: 3px solid #e85b04;
 `}
`;

export const SidebarButton = styled.button`
  margin: 0.3rem 0;
  cursor: pointer;

  &:first-of-type {
    margin-top: 1rem;
  }
`;

const Form = styled.main`
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
