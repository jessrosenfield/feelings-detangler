import { useCallback, useEffect, useMemo, useState } from "react";
import LoopingList from "../util/LoopingList";
import enums from "../util/enums.json"
import { Flex, Grid, GridItem } from "@chakra-ui/layout";
import { convertNestedToTieredValues, TieredValue } from "./util";
import feelingsWheel from "../feelings-wheel.jpeg";

const colors = [
  {dark: "#36BA9F",
  light: "#5CC2AE"
},
  {dark: "#00A4B9",
  light: "#15BCCA"
},
  {dark: "#7672B4",
  light: "#8C8CC4"
},
  {dark: "#AB7BB5",
  light: "#B58DC0"
},
  {dark: "#CE7C87",
  light: "#E297A5"
},
  {dark: "#E2876E",
  light: "#EF9783"
},
  {dark: "#E5A44B",
  light: "#ECB45D"
},
];

export default function OriginalWheel() {
  return (
    <Flex direction="column" width="80%" justify="center">
    <img width="50%" src={feelingsWheel} alt="feelings wheel" />
    </Flex>
  );
}