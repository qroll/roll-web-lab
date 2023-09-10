import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import styled from "styled-components";

const data = new Array(15).fill(0).map((_, i) => ({
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

const Block = styled.div`
  font-size: 30px;
  width: 50vw;
  height: 100vh;
`;

const TableWrapper = styled.div<{ $end: boolean }>`
  position: relative;
  overflow: auto;
`;

const Table = styled.table<{ $end: boolean; $start: boolean }>`
  text-align: left;
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;

  thead {
    position: sticky;
    top: 0;

    th {
      border-bottom: 1px solid black;
      border-top: 1px solid black;
      padding: 1rem;
      background: #baf;
    }

    th:first-child {
      border-left: 1px solid black;
      border-radius: ${(props) => (props.$start ? "10px 0 0 0" : "0")};
      overflow: hidden;
    }

    th:last-child {
      border-right: 1px solid black;
      border-radius: ${(props) => (props.$start ? "0 10px 0 0" : "0")};
      overflow: hidden;
    }
  }

  tbody {
    flex: 1;
    overflow: auto;

    tr:nth-child(odd) {
      background: #eee;
    }

    td {
      border-bottom: 1px solid black;
      padding: 2rem 1rem;
    }

    td:first-child {
      border-left: 1px solid black;
    }

    td:last-child {
      border-right: 1px solid black;
    }

    tr:last-child td {
      border-bottom: 1px solid black;
    }

    ${(props) =>
      !props.$end &&
      `
    tr:last-child {
      td {
        border-bottom: 1px solid black;
      }

      td:first-child {
        border-bottom-left-radius: 10px;
      }

      td:last-child {
        border-bottom-right-radius: 10px;
      }
    }
    `}
  }

  tfoot {
    position: sticky;
    bottom: 0;
  }
`;

const ActionBarWrapper = styled.div<{ $end: boolean }>``;

const ActionBar = styled.div<{ $end: boolean }>`
  background: #fab;
  border-radius: 0 0 10px 10px;
  border: 1px solid black;
  border-top: none;
  overflow: hidden;
  transition: transform 1s ease;
  padding: 1rem;

  ${(props) =>
    !props.$end &&
    `
        transform: translateY(-16px);
        border-radius: 10px;
        box-shadow: 0 0 4px 0 black;
        border-top: 1px solid black;
      `}
`;

const TablePage = () => {
  const [footerOffset, setFooterOffset] = useState(0);
  const [headerOffset, setHeaderOffset] = useState(0);
  const tableRef = useRef<HTMLTableElement | null>(null);
  const tableEndRef = useRef<HTMLDivElement | null>(null);
  const tableStartRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLTableSectionElement | null>(null);
  const actionBarRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [scrollable, setScrollable] = useState(false);

  const { ref: startRef, inView: start } = useInView();
  const { ref: endRef, inView: end } = useInView();
  const { ref: lastRowRef, inView: rowEnd } = useInView();

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
      const maxBottomOffset = Math.min(bottomOffset, tableRef.current.getBoundingClientRect().height - 200);

      actionBarRef.current.style.transform = `translateY(-${maxBottomOffset}px)`;
    } else {
      actionBarRef.current.style.transform = `translateY(0)`;
    }

    if (startBounds.top > 0) {
      headerRef.current.style.transform = `translateY(0)`;
    } else {
      const topOffset = Math.abs(startBounds.top);
      const maxOffset = Math.min(topOffset, tableRef.current.getBoundingClientRect().height - 200);
      headerRef.current.style.transform = `translateY(${maxOffset}px)`;
    }
  };

  useEffect(() => {
    if (!wrapperRef.current) {
      return;
    }

    const observer = new ResizeObserver(() => {
      setScrollable(wrapperRef.current!.scrollHeight > wrapperRef.current!.clientHeight);
    });

    observer.observe(wrapperRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (scrollable) {
      return;
    }

    const scrollHandler = () => {
      requestAnimationFrame(() => {
        if (!wrapperRef.current) {
          return;
        }

        calculateStickyInViewport();
      });
    };
    window.addEventListener("scroll", scrollHandler, { passive: true });

    return () => window.removeEventListener("scroll", scrollHandler);
  }, [scrollable]);

  return (
    <div>
      <Block>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat provident quaerat temporibus explicabo sequi
        praesentium, rerum enim deserunt placeat et ipsa, laborum sunt ratione commodi, eveniet veniam ducimus excepturi
        dicta.
      </Block>
      <TableWrapper $end={end} ref={wrapperRef}>
        <div
          ref={(r) => {
            tableStartRef.current = r;
            startRef(r);
          }}
        ></div>
        <Table $start={start} $end={end} ref={tableRef}>
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
                <tr key={i}>
                  <td>{d.col1}</td>
                  <td>{d.col2}</td>
                  <td>{d.col3}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr ref={lastRowRef}>
              <td colSpan={3}>
                <ActionBarWrapper ref={actionBarRef} $end={end}>
                  <ActionBar $end={end}>omg</ActionBar>
                </ActionBarWrapper>
              </td>
            </tr>
          </tfoot>
        </Table>
        <div
          ref={(r) => {
            tableEndRef.current = r;
            endRef(r);
          }}
        ></div>
      </TableWrapper>
      <Block>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat provident quaerat temporibus explicabo sequi
        praesentium, rerum enim deserunt placeat et ipsa, laborum sunt ratione commodi, eveniet veniam ducimus excepturi
        dicta.
      </Block>
    </div>
  );
};

export default TablePage;
