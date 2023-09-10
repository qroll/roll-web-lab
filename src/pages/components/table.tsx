import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Block = styled.div`
  font-size: 30px;
`;

const Container = styled.div`
  padding: 1rem;

  display: flex;
  flex-direction: column;
`;

const TableWrapper = styled.div<{ $sticky: boolean }>`
  flex: 1;
  overflow: auto;
`;

const Table = styled.table<{ $sticky: boolean }>`
  text-align: left;
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;

  th {
    padding: 0 1rem;

    > div {
      display: flex;
      height: 100%;
      width: 100%;

      > div:first-child {
        flex: 1;
      }

      > div:nth-child(2) {
        flex: 0;
      }
    }
  }

  td {
    padding: 2rem 1rem;
  }

  thead {
    background: #fab;
    position: sticky;
    top: 0;

    th {
      border-bottom: 1px solid black;
      border-top: 1px solid black;
    }

    th:first-child {
      border-left: 1px solid black;
      border-radius: 10px 0 0 0;
      overflow: hidden;
    }

    th:last-child {
      border-right: 1px solid black;
      border-radius: 0 10px 0 0;
      overflow: hidden;
    }
  }

  tbody {
    flex: 1;
    overflow: auto;

    td {
      border-bottom: 1px solid black;
    }

    td:first-child {
      border-left: 1px solid black;
    }

    td:last-child {
      border-right: 1px solid black;
    }

    ${(props) =>
      !props.$sticky &&
      `
    tr:last-child td {
        border-bottom: none;
    }
    `}
  }
`;

const TouchTarget = styled.div`
  cursor: pointer;
  width: 1rem;
  flex-shrink: 0;
  height: 100px;
  display: flex;
  justify-content: center;
`;

const Handle = styled.div`
  width: 1px;
  background: black;
  height: 100%;
`;

const ActionBar = styled.div<{ $sticky: boolean }>`
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
  const [colWidth, setColWidth] = useState<Record<string, number>>({
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
      <Container>
        <TableWrapper $sticky={sticky}>
          <Table $sticky={sticky} ref={tableRef}>
            <thead>
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
              <tr>
                <td>Lorem ipsum dolor sit amet.</td>
                <td>Lorem ipsum dolor sit amet.</td>
                <td>Lorem ipsum dolor sit amet.</td>
              </tr>
              <tr>
                <td>Lorem ipsum dolor sit amet.</td>
                <td>Lorem, ipsum.</td>
                <td>Lorem ipsum dolor sit amet.</td>
              </tr>
              <tr>
                <td>Lorem ipsum dolor sit amet.</td>
                <td>Lorem, ipsum.</td>
                <td>Lorem ipsum dolor sit amet.</td>
              </tr>
              <tr>
                <td>Lorem ipsum dolor sit amet.</td>
                <td>Lorem, ipsum.</td>
                <td>Lorem ipsum dolor sit amet.</td>
              </tr>
              <tr>
                <td>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex eaque, consequatur enim, magni praesentium
                  alias, iusto vel possimus similique rerum placeat porro earum harum autem ipsam in sunt tempore
                  dignissimos.
                </td>
                <td>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex eaque, consequatur enim, magni praesentium
                  alias, iusto vel possimus similique rerum placeat porro earum harum autem ipsam in sunt tempore
                  dignissimos.
                </td>
                <td>Lorem ipsum dolor sit amet.</td>
              </tr>
              <tr>
                <td>Lorem ipsum dolor sit amet.</td>
                <td>Lorem, ipsum.</td>
                <td>Lorem ipsum dolor sit amet.</td>
              </tr>
              <tr>
                <td>Lorem ipsum dolor sit amet.</td>
                <td>Lorem, ipsum.</td>
                <td>Lorem ipsum dolor sit amet.</td>
              </tr>
            </tbody>
            <tfoot>
              <tr ref={tableEndRef}></tr>
            </tfoot>
          </Table>
        </TableWrapper>
        <div ref={stickyRef}></div>
        <ActionBar $sticky={sticky}>omg</ActionBar>
      </Container>
      <Block>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat provident quaerat temporibus explicabo sequi
        praesentium, rerum enim deserunt placeat et ipsa, laborum sunt ratione commodi, eveniet veniam ducimus excepturi
        dicta.
      </Block>
    </div>
  );
};

export default TablePage;
