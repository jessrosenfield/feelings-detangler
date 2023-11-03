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

export default function Wheel() {
  const feelings: TieredValue[][] = useMemo(() => convertNestedToTieredValues(enums.feelingsWheelFeelings), []);
  const [currentFeeling, setCurrentFeeling] = useState<number[]>(Array(feelings.length).fill([]));
  const [isRecentering, setIsRecentering] = useState<boolean[]>(Array(feelings.length).fill(true));
  useEffect(() => {
    console.log({currentFeeling, isRecentering});
  }, [currentFeeling, isRecentering]);

  return (
    <Flex direction="column" width="80%" justify="center">
    <Grid w="100%" templateColumns={`repeat(${feelings.length}, 1fr)`}>
      {feelings.map((tier: TieredValue[], tierIndex: number) => {
        const items = tier.map(item => (
          <span style={{color: 'white', backgroundColor: colors[item.dims[0]][tierIndex > 0 && item.dims[1]%2 === 0 ? "light" : "dark"]}} key={
            item.dims.slice(0, tierIndex+1).map((dim, dimIndex) => feelings[dimIndex][dim].value).join("-")
          }>{item.value}</span>
        ));
        return (
          <GridItem key={tierIndex} w='100%' h='10'>
          <LoopingList
            flexBasis="0"
            flexGrow="1"
            heightPixels={300}
            maxItemsToShow={4}
            currentIndex={currentFeeling[tierIndex]}
            setCurrentIndex={(index) => {
              setCurrentFeeling(feelings[tierIndex][index].dims);
              setIsRecentering(Array(feelings.length).fill(true));
            }}
            isRecentering={isRecentering[tierIndex]}
            setIsRecentering={(val) =>
              setIsRecentering((prev) => (
                prev.map((item, index) => index === tierIndex ? val : item
              )))
            }
          >
            {items}
          </LoopingList>
          </GridItem>
        );
      })}
    </Grid>
    <img src={feelingsWheel} alt="feelings wheel" />
    </Flex>
  );
}