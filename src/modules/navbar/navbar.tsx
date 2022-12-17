import Link from "next/link";
import styled from "styled-components";
import { ThemeSwitcher } from "../theme/theme-switcher";

function Navbar() {
  return (
    // A11Y: custom label as page has multiple nav sections
    <NavWrapper aria-label="App">
      <Link href="/" passHref>
        <NavLink>Main</NavLink>
      </Link>
      <Divider />
      <ThemeSwitcher />
    </NavWrapper>
  );
}

export default Navbar;

const NavWrapper = styled.nav`
  background: #e85b04;
  color: white;
  height: 4rem;
  display: flex;
  align-items: center;
  margin: 1rem;
  border-radius: 1rem;
`;

const Divider = styled.div`
  margin-left: auto;
  background: #fff;
  height: 60%;
  width: 1px;
`;

const NavLink = styled.span`
  margin: 0 1rem;
`;
