import Link from "next/link";
import styled from "styled-components";

interface LinkListProps {
  items: {
    href: string;
    label: string;
  }[];
}

export const LinkList = ({ items }: LinkListProps) => {
  return (
    <List>
      {items.map((item) => {
        return (
          <ListItem key={item.label}>
            <Link href={item.href}>
              <ListLink>{item.label}</ListLink>
            </Link>
          </ListItem>
        );
      })}
    </List>
  );
};

const List = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
`;

const ListItem = styled.li`
  margin-right: 1rem;
`;

const ListLink = styled.span`
  border-radius: 0.5rem;
  border: 1px solid #bbb;
  text-align: center;
  padding: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 0 3px 3px rgba(125, 125, 125, 0.1);
  }
`;
