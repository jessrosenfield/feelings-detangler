import * as React from "react";
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Flex,
  Grid,
  TabList,
  Tabs,
  TabPanels,
  TabPanel,
  Tab,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import NVC from "./nvc/NVC";
import theme from "./theme";
import Wheel from "./wheel/Wheel";

export const App = () => {
  const listRef = React.useRef(null);
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid overflow="hidden" minH="100vh" p={3}>
          <Tabs>
            <Flex justify="right">
              <ColorModeSwitcher justifySelf="flex-end" />
            </Flex>
            <TabList>
              <Tab>Wheel</Tab>
              <Tab>NVC</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Wheel/>
              </TabPanel>
              <TabPanel>
                <NVC/>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Grid>
      </Box>
    </ChakraProvider>
  );
};
