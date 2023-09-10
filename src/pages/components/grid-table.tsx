import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const data = new Array(15).fill(0).map(() => ({
  col1: "Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.",
  col2: "Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.",
  col3: <button>Click me!</button>,
}));

const Block = styled.div`
  font-size: 30px;
`;

const Table = styled.div<{ $sticky: boolean }>`
  display: grid;
  grid-template-columns: auto auto auto;
  grid-template-rows: auto minmax(0, 1fr) auto;

  text-align: left;
  max-height: 60vh;
`;

const THead = styled.div`
  display: grid;
  grid-column: 1 / 4;
  grid-template-columns: subgrid;
`;

const TBody = styled.div`
  display: grid;
  grid-column: 1 / 4;
  grid-template-columns: subgrid;

  background: #fba;
  overflow-y: auto;
`;

const TFoot = styled.div`
  grid-column: 1 / 4;
  grid-template-columns: subgrid;
`;

const HeaderRow = styled.div`
  display: grid;
  grid-column: 1 / 4;
  grid-template-columns: subgrid;
  position: sticky;
  top: 0;
`;

const Row = styled.div`
  display: grid;
  grid-column: 1 / 4;
  grid-template-columns: subgrid;
`;

const HeaderCell = styled.div`
  background: #baf;
  padding: 2rem 1rem;
`;

const BodyCell = styled.div`
  padding: 2rem 1rem;
`;

const ActionBar = styled.div<{ $sticky: boolean }>`
  grid-column: 1 / 4;
  position: sticky;
  bottom: 0;
  background: #fab;
  border-radius: 0 0 10px 10px;
  overflow: hidden;
  border: 1px solid black;
  transition: all 1s ease;
  padding: 1rem;

  ${(props) =>
    props.$sticky &&
    `
        transform: translateX(-0.5%) translateY(-16px);
        border-radius: 10px;
        box-shadow: 0 0 4px 0 black;
        width: 101%;
      `}
`;

const TablePage = () => {
  const [sticky, setSticky] = useState(false);
  const stickyRef = useRef<HTMLDivElement>(null);
  const tableEndRef = useRef<HTMLTableRowElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const [colWidth, setColWidth] = useState({
    col1: 30,
    col2: 30,
    col3: 40,
  });

  const dragState = useRef<{ colName: string | undefined; start: number }>({ colName: undefined, start: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      let intersect = false;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          intersect = true;
        }
      });
      setSticky(!intersect);
    }, {});

    if (stickyRef.current) {
      observer.observe(stickyRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <Block>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat provident quaerat temporibus explicabo sequi
        praesentium, rerum enim deserunt placeat et ipsa, laborum sunt ratione commodi, eveniet veniam ducimus excepturi
        dicta.
      </Block>
      <Table $sticky={sticky} ref={tableRef} role="table">
        <HeaderRow role="row">
          <HeaderCell role="columnheader">
            <div>Lorem ipsum dolor, sit amet consectetur adipisicing elit</div>
          </HeaderCell>
          <HeaderCell role="columnheader">
            <div>Lorem ipsum dolor</div>
          </HeaderCell>
          <HeaderCell role="columnheader">
            <div>Lorem ipsum dolor</div>
          </HeaderCell>
        </HeaderRow>
        <TBody>
          {data.map((d, i) => {
            return (
              <Row key={i} role="row">
                <BodyCell role="cell">{d.col1}</BodyCell>
                <BodyCell role="cell">{d.col2}</BodyCell>
                <BodyCell role="cell">{d.col3}</BodyCell>
              </Row>
            );
          })}
        </TBody>
        <ActionBar $sticky={sticky}>omg</ActionBar>
      </Table>
      <div ref={stickyRef}></div>
      <Block>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat provident quaerat temporibus explicabo sequi
        praesentium, rerum enim deserunt placeat et ipsa, laborum sunt ratione commodi, eveniet veniam ducimus excepturi
        dicta.
      </Block>
    </div>
  );
};

export default TablePage;
