import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import styled, { css } from "styled-components";
import { Page, PageContent } from "../../components/common/page";

const Block = styled.div`
  font-size: 30px;
  width: 50vw;
  height: 100vh;
`;

const TableWrapper = styled.div<{ $end: boolean; $start: boolean; $scrollable: boolean }>`
  overflow: auto;

  background: white;

  border: 1px solid black;
  border-top-left-radius: ${(props) => (props.$start || props.$scrollable ? "10px" : "0")};
  border-top-right-radius: ${(props) => (props.$start || props.$scrollable ? "10px" : "0")};
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;

  display: flex;
  flex-direction: column;
`;

const TableContainer = styled.div`
  flex: 1;
`;

const Table = styled.table<{ $end: boolean; $start: boolean; $scrollable: boolean }>`
  text-align: left;
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;

  thead {
    position: sticky;
    top: 0;

    th {
      border-bottom: 1px solid black;
      padding: 1rem;
      background: #baf;
    }
  }

  tbody {
    tr:nth-child(odd) {
      background: #eee;
    }

    td {
      border-bottom: 1px solid black;
      padding: 2rem 1rem;
    }

    tr:last-child td {
      border-bottom: 1px solid black;
    }

    ${(props) =>
      !props.$end &&
      !props.$scrollable &&
      `
    tr:last-child {
      td {
        border-bottom: 1px solid black;
      }
    }
    `}
  }
`;

const ActionBarWrapper = styled.div`
  position: sticky;
  bottom: 0;
  left: 0;
`;

const ActionBar = styled.div<{ $float: boolean; $scrollable: boolean }>`
  background: #fab;
  border-top: none;
  overflow: hidden;
  transition: transform 1s ease;
  padding: 1rem;

  ${(props) =>
    props.$float &&
    `
        transform: translateY(-16px);
        border-radius: 10px;
        box-shadow: 0 0 4px 0 black;
      `}
`;

interface TableProps {
  data: { col1: React.ReactNode; col2: React.ReactNode; col3: React.ReactNode }[];
  className?: string;
}

const DataTable = ({ data, className }: TableProps) => {
  const tableRef = useRef<HTMLTableElement | null>(null);
  const tableEndRef = useRef<HTMLDivElement | null>(null);
  const tableStartRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLTableSectionElement | null>(null);
  const firstRowRef = useRef<HTMLTableRowElement | null>(null);
  const lastRowRef = useRef<HTMLTableRowElement | null>(null);
  const actionBarRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [scrollable, setScrollable] = useState(false);
  const [scrollEnd, setScrollEnd] = useState(false);
  const [tableEnd, setTableEnd] = useState(false);

  const { ref: startRef, inView: start } = useInView();
  const { ref: endRef, inView: end } = useInView();
  const { ref: rowEndRef, inView: rowEnd } = useInView({ threshold: 1 });

  const calculateStickyInViewport = () => {
    if (
      !tableRef.current ||
      !tableEndRef.current ||
      !tableStartRef.current ||
      !wrapperRef.current ||
      !actionBarRef.current ||
      !headerRef.current
    ) {
      return;
    }

    const startBounds = tableStartRef.current.getBoundingClientRect();
    const endBounds = tableEndRef.current.getBoundingClientRect();

    if (endBounds.top > window.innerHeight) {
      const bottomOffset = endBounds.bottom - window.innerHeight;
      const bottomToHeaderOffset =
        tableRef.current.getBoundingClientRect().height - headerRef.current.clientHeight - 32;
      const maxBottomOffset = Math.min(bottomOffset, bottomToHeaderOffset);

      actionBarRef.current.style.transform = `translateY(-${maxBottomOffset}px)`;
    } else {
      actionBarRef.current.style.transform = `translateY(0)`;
    }

    if (startBounds.top > 0) {
      headerRef.current.style.transform = `translateY(0)`;
    } else {
      const topOffset = Math.abs(startBounds.top);
      const topToFooterOffset =
        tableRef.current.getBoundingClientRect().height -
        actionBarRef.current.clientHeight * 2 -
        (lastRowRef.current?.clientHeight ?? 0);
      const maxOffset = Math.min(topOffset, Math.max(0, topToFooterOffset));
      headerRef.current.style.transform = `translateY(${maxOffset}px)`;
    }
  };

  const calculateStickyInScrollContainer = () => {
    if (
      !tableRef.current ||
      !tableEndRef.current ||
      !tableStartRef.current ||
      !wrapperRef.current ||
      !actionBarRef.current ||
      !headerRef.current
    ) {
      return;
    }

    const startBounds = wrapperRef.current.getBoundingClientRect();
    const endBounds = wrapperRef.current.getBoundingClientRect();

    if (endBounds.bottom > window.innerHeight) {
      const bottomOffset = endBounds.bottom - window.innerHeight;
      const bottomToHeaderOffset =
        wrapperRef.current.getBoundingClientRect().height -
        headerRef.current.clientHeight -
        (firstRowRef.current?.clientHeight ?? 0);
      const maxBottomOffset = Math.min(bottomOffset, bottomToHeaderOffset);
      actionBarRef.current.style.transform = `translateY(-${maxBottomOffset}px)`;
    } else {
      actionBarRef.current.style.transform = `translateY(0)`;
    }

    if (startBounds.top > 0) {
      headerRef.current.style.transform = `translateY(0)`;
    } else {
      const topOffset = Math.abs(startBounds.top);
      const topToFooterOffset =
        wrapperRef.current.getBoundingClientRect().height -
        headerRef.current.clientHeight -
        actionBarRef.current.clientHeight -
        (lastRowRef.current?.clientHeight ?? 0);
      const maxOffset = Math.min(topOffset, Math.max(0, topToFooterOffset));
      headerRef.current.style.transform = `translateY(${maxOffset - 1}px)`;
    }
  };

  useEffect(() => {
    if (!wrapperRef.current) {
      return;
    }

    const observer = new ResizeObserver(() => {
      const scrollable = wrapperRef.current!.scrollHeight > wrapperRef.current!.clientHeight;
      setScrollable(scrollable);

      if (scrollable) {
        calculateStickyInScrollContainer();
      } else {
        calculateStickyInViewport();
      }
    });

    observer.observe(wrapperRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const scrollHandler = () => {
      requestAnimationFrame(() => {
        if (scrollable) {
          calculateStickyInScrollContainer();
        } else {
          calculateStickyInViewport();
        }
      });

      if (wrapperRef.current) {
        setTableEnd(wrapperRef.current.getBoundingClientRect().bottom <= window.innerHeight);
      }
    };
    window.addEventListener("scroll", scrollHandler, { passive: true });

    return () => window.removeEventListener("scroll", scrollHandler);
  }, [scrollable]);

  return (
    <TableWrapper
      ref={wrapperRef}
      $start={start}
      $end={tableEnd}
      $scrollable={scrollable}
      className={className}
      onScroll={() => {
        if (scrollable && wrapperRef.current) {
          setScrollEnd(
            wrapperRef.current.scrollTop + wrapperRef.current.clientHeight >= wrapperRef.current.scrollHeight
          );
        }
      }}
    >
      <div
        ref={(r) => {
          tableStartRef.current = r;
          startRef(r);
        }}
      ></div>
      <TableContainer>
        <Table $start={start} $end={tableEnd} $scrollable={scrollable} ref={tableRef}>
          <thead ref={headerRef}>
            <tr>
              <th>
                <div>Lorem ipsum dolor, sit amet consectetur adipisicing elit</div>
              </th>
              <th>
                <div>Lorem ipsum dolor</div>
              </th>
              <th>
                <div>Lorem ipsum dolor</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => {
              return (
                <tr
                  key={i}
                  ref={(r) => {
                    if (i === data.length - 1) {
                      rowEndRef(r);
                      lastRowRef.current = r;
                    }
                    if (i === 0) {
                      firstRowRef.current = r;
                    }
                  }}
                >
                  <td>{d.col1}</td>
                  <td>{d.col2}</td>
                  <td>{d.col3}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </TableContainer>
      <ActionBarWrapper ref={actionBarRef}>
        <ActionBar $float={(!scrollable && !end) || (scrollable && (!scrollEnd || !tableEnd))} $scrollable={scrollable}>
          omg
        </ActionBar>
      </ActionBarWrapper>
      <div
        ref={(r) => {
          tableEndRef.current = r;
          endRef(r);
        }}
      ></div>
    </TableWrapper>
  );
};

const StyledDataTable = styled(DataTable)<{ $heightType: "fixed" | "max" | "grow"; $widthType: "auto" | "fixed" }>`
  max-width: 80vw;
  margin: 1rem;

  ${(props) => {
    switch (props.$heightType) {
      case "fixed":
        return "height: 80vh;";
      case "max":
        return "max-height: 80vh;";
      case "grow":
        return;
    }
  }}

  ${(props) => {
    switch (props.$widthType) {
      case "fixed":
        return css`
          table {
            table-layout: fixed;

            th {
              width: 45vw;
            }
          }
        `;
      case "auto":
        return;
    }
  }}
`;

const TablePage = () => {
  const [dataLength, setDataLength] = useState(1);
  const [heightType, setHeightType] = useState<"fixed" | "max" | "grow">("max");
  const [widthType, setWidthType] = useState<"auto" | "fixed">("auto");

  const data = new Array(dataLength).fill(0).map((_, i) => ({
    col1:
      i % 8 === 0
        ? "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex eaque, consequatur enim, magni praesentium alias, iusto vel possimus similique rerum placeat porro earum harum autem ipsam in sunt tempore dignissimos."
        : "Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.",
    col2:
      i % 8 === 0
        ? "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex eaque, consequatur enim, magni praesentium alias, iusto vel possimus similique rerum placeat porro earum harum autem ipsam in sunt tempore dignissimos."
        : "Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.",
    col3: <button>Click me!</button>,
  }));

  return (
    <Page>
      <PageContent>
        <input
          type="range"
          min={0}
          max={15}
          value={dataLength}
          onChange={(e) => setDataLength(parseInt(e.target.value))}
        />
        <div>
          <h2>Height</h2>
          <div>
            <input
              type="radio"
              name="height type"
              value="fixed"
              onChange={(e) => setHeightType(e.target.value as any)}
            />{" "}
            Fixed
            <input
              type="radio"
              name="height type"
              value="max"
              onChange={(e) => setHeightType(e.target.value as any)}
            />{" "}
            Max
            <input
              type="radio"
              name="height type"
              value="grow"
              onChange={(e) => setHeightType(e.target.value as any)}
            />{" "}
            Grow
          </div>
        </div>
        <div>
          <h2>Width</h2>
          <div>
            <input type="radio" name="width type" value="auto" onChange={(e) => setWidthType(e.target.value as any)} />
            Auto
            <input type="radio" name="width type" value="fixed" onChange={(e) => setWidthType(e.target.value as any)} />
            Fixed
          </div>
        </div>
        <Block>Scroll down to see the table</Block>
        <StyledDataTable $heightType={heightType} $widthType={widthType} data={data} />
        <Block>Scroll up to see the table</Block>
      </PageContent>
    </Page>
  );
};

export default TablePage;
