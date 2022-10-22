import styled from "styled-components";

export default function GridPage() {
  return (
    <Grid>
      <A>A</A>
      <B>B</B>
      <C>C</C>
      <D>D</D>
      <E>E</E>
      <F>F</F>
    </Grid>
  );
}

const Grid = styled.div`
  height: 100vh;
  display: grid;
  grid-template-areas:
    "a b c"
    "d e f";
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  justify-items: center;
`;

const Cell = styled.div`
  background-color: #fab;
  width: 50%;
  height: 100px;
  border: 1px solid #000;
`;

const A = styled(Cell)`
  grid-area: a;
`;

const B = styled(Cell)`
  grid-area: b;
`;

const C = styled(Cell)`
  grid-area: c;
`;

const D = styled(Cell)`
  grid-area: d;
  align-self: start;
`;

const E = styled(Cell)`
  grid-area: e;
  height: 400px;
`;

const F = styled(Cell)`
  grid-area: f;
  align-self: end;
`;
