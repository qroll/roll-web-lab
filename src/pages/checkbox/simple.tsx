import React, { useState } from "react";
import styled from "styled-components";
import { CheckboxWithLabel } from "../../modules/checkbox/checkbox-with-label";
import { Type } from "../../modules/typography/type";

export default function SimpleCheckboxPage() {
  const [optionA, setOptionA] = useState(false);
  const [optionB, setOptionB] = useState(true);
  const [optionC, setOptionC] = useState(false);
  const [optionD, setOptionD] = useState(true);
  return (
    <Page>
      <Type.H1 bold>Simple checkbox</Type.H1>
      <CheckboxWithLabel id="checkbox-A" checked={optionA} onChange={(e) => setOptionA(e.target.checked)}>
        Icecream sandwich
      </CheckboxWithLabel>
      <CheckboxWithLabel id="checkbox-B" checked={optionB} onChange={(e) => setOptionB(e.target.checked)}>
        Jelly bean
      </CheckboxWithLabel>
      <CheckboxWithLabel id="checkbox-C" checked={optionC} disabled onChange={(e) => setOptionC(e.target.checked)}>
        Lollipop
      </CheckboxWithLabel>
      <CheckboxWithLabel id="checkbox-D" checked={optionD} disabled onChange={(e) => setOptionD(e.target.checked)}>
        Marshmallow
      </CheckboxWithLabel>
    </Page>
  );
}

const Page = styled.main`
  margin: 1rem auto;
  max-width: calc(1080px - 2rem);
`;
