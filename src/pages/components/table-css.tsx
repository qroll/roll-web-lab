import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Block = styled.div`
  font-size: 30px;
`;

const Table = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto minmax(0, 1fr) auto;

  text-align: left;
  max-height: 80vh;
  width: fit-content;
`;

const THead = styled.div`
  position: sticky;
  top: 0;
`;

const TBody = styled.div`
  background: #fba;
  width: fit-content;
  overflow-y: auto;
`;

const TFoot = styled.div`
  display: grid;
  grid-template-columns: auto;
  position: sticky;
  bottom: 0;
`;

const HeaderRow = styled.div<{ $sticky: boolean }>`
  position: sticky;
  top: 0;
  display: grid;
  grid-template-columns: auto auto auto;

  background: #baf;
  border: 1px solid black;
  border-radius: 10px 10px 0 0;
  overflow: hidden;

  ${(props) =>
    props.$sticky &&
    `
  border-radius: 0;
  `}
`;

const FooterRow = styled.div`
  display: block;
  grid-column: 1 / 4;
`;

const FooterCell = styled.div`
  display: block;
`;

const HeaderCell = styled.div<{ $width: number }>`
  display: flex;
  width: ${(props) => props.$width}px;
  padding: 2rem 1rem;
`;

const BodyRow = styled.div`
  border: 1px solid black;
  border-top: none;

  &:last-child {
    border-bottom: none;
  }
`;

const BodyCell = styled.div`
  display: inline-block;
  padding: 2rem 1rem;
`;

const ActionBar = styled.div<{ $sticky: boolean }>`
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

const data = new Array(15).fill(0).map(() => ({
  col1: "Lorem ipsum dolor sit amet.",
  col2: (
    <>
      The quick brown fox jumps over the <a href="https://google.com">lazy</a> dog
    </>
  ),
  col3: <button>Click me</button>,
}));

const TablePage = () => {
  const [stickyActionBar, setStickyActionBar] = useState(false);
  const [stickyHeader, setStickyHeader] = useState(false);
  const stickyActionBarRef = useRef<HTMLDivElement>(null);
  const stickyHeaderRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const [colWidth, setColWidth] = useState({
    col1: 30,
    col2: 30,
    col3: 40,
  });

  const headerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === stickyActionBarRef.current) {
          setStickyActionBar(!entry.isIntersecting);
        }
        if (entry.target === stickyHeaderRef.current) {
          setStickyHeader(!entry.isIntersecting);
        }
      });
    }, {});

    if (stickyActionBarRef.current) {
      observer.observe(stickyActionBarRef.current);
    }

    if (stickyHeaderRef.current) {
      observer.observe(stickyHeaderRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const i = rowRefs.current.findIndex((e) => e === entry.target);
        setColWidth((w) => ({
          ...w,
          [Object.keys(w)[i]]: entry.contentRect.width,
        }));
      }
    });

    for (const ref of rowRefs.current) {
      if (ref) {
        observer.observe(ref);
      }
    }

    return () => observer.disconnect();
  }, rowRefs.current);

  console.log(colWidth);

  return (
    <div>
      <Block>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat provident quaerat temporibus explicabo sequi
        praesentium, rerum enim deserunt placeat et ipsa, laborum sunt ratione commodi, eveniet veniam ducimus excepturi
        dicta.
      </Block>
      <div ref={stickyHeaderRef}></div>
      <Table ref={tableRef} role="grid" aria-multiselectable>
        <THead role="rowgroup">
          <HeaderRow role="row" $sticky={stickyHeader}>
            <HeaderCell $width={colWidth.col1} ref={(r) => (headerRefs.current[0] = r)} role="columnheader">
              <div>Lorem ipsum</div>
            </HeaderCell>
            <HeaderCell $width={colWidth.col2} ref={(r) => (headerRefs.current[1] = r)} role="columnheader">
              <div>Lorem ipsum dolor</div>
            </HeaderCell>
            <HeaderCell $width={colWidth.col3} ref={(r) => (headerRefs.current[2] = r)} role="columnheader">
              <div>Lorem ipsum dolor</div>
            </HeaderCell>
          </HeaderRow>
        </THead>
        <TBody role="rowgroup">
          {data.map((d, i) => {
            return (
              <BodyRow key={i} role="row">
                <BodyCell role="cell" ref={(r) => (rowRefs.current[0] = r)}>
                  {d.col1}
                </BodyCell>
                <BodyCell role="cell" ref={(r) => (rowRefs.current[1] = r)}>
                  {d.col2}
                </BodyCell>
                <BodyCell role="cell" ref={(r) => (rowRefs.current[2] = r)}>
                  {d.col3}
                </BodyCell>
              </BodyRow>
            );
          })}
        </TBody>
        <TFoot role="rowgroup">
          <FooterRow role="row">
            <FooterCell role="cell">
              <ActionBar $sticky={stickyActionBar}>
                <button>Clear all</button>
              </ActionBar>
            </FooterCell>
          </FooterRow>
        </TFoot>
      </Table>
      <div ref={stickyActionBarRef}></div>
      <Block>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat provident quaerat temporibus explicabo sequi
        praesentium, rerum enim deserunt placeat et ipsa, laborum sunt ratione commodi, eveniet veniam ducimus excepturi
        dicta.
      </Block>
    </div>
  );
};

export default TablePage;
