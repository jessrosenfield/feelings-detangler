import * as React from "react";
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import NVC from "./nvc/NVC";
import theme from "./theme";
import LoopingList from "./util/LoopingList";

export const App = () => {
  const listRef = React.useRef(null);
  return (
  <ChakraProvider theme={theme}>
    <Box textAlign="center" fontSize="xl">
      <Grid minH="100vh" p={3}>
        <ColorModeSwitcher justifySelf="flex-end" />
        <NVC />
      </Grid>
    </Box>
  </ChakraProvider>
)};
