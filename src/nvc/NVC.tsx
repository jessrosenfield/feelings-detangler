import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Textarea,
  useMediaQuery,
  HStack,
  TagLabel,
  Tag,
  TagCloseButton,
  Text,
  VStack,
  Box,
  Alert,
  AlertDescription,
  AlertTitle,
  CloseButton,
  List,
  ListItem,
  StackDivider,
  Checkbox,
} from "@chakra-ui/react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import React, { useState } from "react";
import enums from "../util/enums.json";
import _range from "lodash/range";
import _startCase from "lodash/startCase";
import _sortBy from "lodash/sortBy";
import _without from "lodash/without";
import LoopingList from "../util/LoopingList";

const nvcFeelings = enums.unmetNeedsFeelings;
const nvcNeeds = enums.needs;

export default function NVC() {
  const [observations, setObservations] = useState<string>("");
  const [feelings, setFeelings] = useState<string[]>([]);
  const [needs, setNeeds] = useState<string[]>([]);
  const [requests, setRequests] = useState<string>("");
  return (
    <>

<LoopingList height="400px" maxItemsToShow={4} currentIndex={0} setCurrentIndex={(num) => { } }>
          <span key="hello">hello</span>
          <span key="hi">hi</span>
          <span key="hiya">hiya</span>
          <span key="bye">bye</span>
          <span key="b yebye">byebye</span>
          <span key="goodbye">goodbye</span>
          <span key="adios">adios</span>
          <span key="nope">nope</span>
    </LoopingList>
      <h1>Non-Violent Communication</h1>
      <p>
        With this framework we listen inwardly to connect with our own feelings
        and needs.
      </p>
      <VStack spacing={8}>
        <ButtonModal
          key="observations"
          label="Observations"
          preview={observations}
        >
          <VStack spacing={8}>
            <Text>
              Description of what is seen or heard without added
              interpretations. For example, instead of "She's having a temper
              tantrum" you could say "She is lying on the floor crying and
              kicking." If referring to what someone said quote as much as
              possible instead of rephrasing.
            </Text>
            <Textarea
              placeholder="When I see/hear"
              value={observations}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                setObservations(event.target.value)
              }
              rows={6}
              resize="none"
            />
          </VStack>
        </ButtonModal>
        <FeelingsModal feelings={feelings} setFeelings={setFeelings} />
        <NeedsModal needs={needs} setNeeds={setNeeds} />
        <ButtonModal key="requests" label="Requests" preview={requests}>
          <VStack spacing={8}>
            <Text>
              Doable, immediate, and stated in positive action language (what
              you want instead of what you don't want). For example, "Would you
              be willing to come back tonight at the time we've agreed" rather
              than "Would you make sure not to be late again?" By definition,
              when we make requests we are open to hearing a "no," taking it as
              an opportuinty for further dialogue.
            </Text>
            <Textarea
              placeholder="When I see/hear"
              value={requests}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                setRequests(event.target.value)
              }
              rows={6}
              resize="none"
            />
          </VStack>
        </ButtonModal>
      </VStack>
    </>
  );
}

function ButtonModal({
  label,
  children,
  preview,
}: {
  label: string;
  children: JSX.Element | JSX.Element[];
  preview?: string | JSX.Element | JSX.Element[];
}): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLargerThan800] = useMediaQuery("(min-width: 800px)");

  return (
    <>
      <VStack>
        <Button width="200px" onClick={onOpen}>
          {label}
        </Button>
        {preview && (
          <Text fontSize="sm" as="i">
            {preview}
          </Text>
        )}
      </VStack>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={isLargerThan800 ? "xl" : "full"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{label}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{children}</ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function FeelingsModal({
  feelings,
  setFeelings,
}: {
  feelings: string[];
  setFeelings: (feelings: string[]) => void;
}) {
  const {
    isOpen: isHelpVisible,
    onClose: onHelpClose,
    onOpen: onHelpOpen,
  } = useDisclosure({ defaultIsOpen: true });

  const feelingsInfo = isHelpVisible ? (
    <Alert status="info">
      <Box>
        <AlertTitle>What are feelings?</AlertTitle>
        <AlertDescription>
          Our emotions rather than our story or thoughts about what others are
          doing. For example, instead of "I feel manipulated," which includes an
          interpretation of another's behavior, you could say "I feel worried."
          Avoid the following phrasing: "I feel like..." and "I feel that..." -
          the next words will be thoughts, not feelings.
        </AlertDescription>
      </Box>
      <CloseButton
        alignSelf="flex-start"
        position="relative"
        right={-1}
        top={-1}
        onClick={onHelpClose}
      />
    </Alert>
  ) : (
    <Button onClick={onHelpOpen}>Help</Button>
  );
  return (
    <ButtonModal key="feelings" label="Feelings">
      <Accordion
        allowMultiple
        defaultIndex={_range(Object.keys(nvcFeelings).length)}
      >
        {feelingsInfo}
        {Object.entries(nvcFeelings).map(([primaryFeeling, subFeelings]) => (
          <AccordionItem key={primaryFeeling}>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  {_startCase(primaryFeeling)}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <StackDivider borderColor="gray.200" />
            <AccordionPanel pb={4}>
              <List spacing={3}>
                {[primaryFeeling, ...subFeelings].map((value) => {
                  const isSelected = feelings.includes(value);
                  const onToggle = () => {
                    if (isSelected) {
                      setFeelings(_without(feelings, value));
                    } else {
                      setFeelings(_sortBy([value, ...feelings]));
                    }
                  };
                  return (
                    <ListItem key="value">
                      <Checkbox isChecked={isSelected} onChange={onToggle}>
                        {_startCase(value)}
                      </Checkbox>
                    </ListItem>
                  );
                })}
              </List>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </ButtonModal>
  );
}

function NeedsModal({
  needs,
  setNeeds,
}: {
  needs: string[];
  setNeeds: (needs: string[]) => void;
}) {
  const {
    isOpen: isHelpVisible,
    onClose: onHelpClose,
    onOpen: onHelpOpen,
  } = useDisclosure({ defaultIsOpen: true });

  const needsInfo = isHelpVisible ? (
    <Alert status="info">
      <Box>
        <AlertTitle>What are needs?</AlertTitle>
        <AlertDescription>
          Feelings are caused by needs, which are universal and ongoing and not
          dependent on the actions of particular individuals. State{" "}
          <em>your need</em> rather than the other person's actions as the
          cause. For example, "I feel annoyed <em>because I need</em> support"
          rather than "I feel annoyed <em>because you</em> didn't do the
          dishes."
        </AlertDescription>
      </Box>
      <CloseButton
        alignSelf="flex-start"
        position="relative"
        right={-1}
        top={-1}
        onClick={onHelpClose}
      />
    </Alert>
  ) : (
    <Button onClick={onHelpOpen}>Help</Button>
  );

  const needsPreview = (
    <HStack spacing={4}>
      {needs.map((item) => (
        <Tag key={item} borderRadius="full" variant="solid" colorScheme="blue">
          <TagLabel>{_startCase(item)}</TagLabel>
          <TagCloseButton onClick={() => setNeeds(_without(needs, item))} />
        </Tag>
      ))}
    </HStack>
  );
  return (
    <ButtonModal key="needs" label="Needs" preview={needsPreview}>
      <Accordion
        allowMultiple
        defaultIndex={_range(Object.keys(nvcNeeds).length)}
      >
        {needsInfo}
        {Object.entries(nvcNeeds).map(([primaryNeed, subNeeds]) => (
          <AccordionItem key={primaryNeed}>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  {_startCase(primaryNeed)}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <StackDivider borderColor="gray.200" />
            <AccordionPanel pb={4}>
              <List spacing={3}>
                {[primaryNeed, ...subNeeds].map((value) => {
                  const isSelected = needs.includes(value);
                  const onToggle = () => {
                    if (isSelected) {
                      setNeeds(_without(needs, value));
                    } else {
                      setNeeds(_sortBy([value, ...needs]));
                    }
                  };
                  return (
                    <ListItem key={value}>
                      <Checkbox isChecked={isSelected} onChange={onToggle}>
                        {_startCase(value)}
                      </Checkbox>
                    </ListItem>
                  );
                })}
              </List>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </ButtonModal>
  );
}
