import { Box, Flex, FlexProps, forwardRef } from "@chakra-ui/react";
import _debounce from "lodash/debounce";
import _throttle from "lodash/throttle";
import React, { UIEventHandler, useCallback, useEffect, useRef } from "react";

interface LoopingListProps extends FlexProps {
  children?: JSX.Element[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  maxItemsToShow?: number;
  itemMinHeight?: number;
};

export default function LoopingList({
  children,
  currentIndex,
  setCurrentIndex,
  maxItemsToShow,
  itemMinHeight,
  ...props
}: LoopingListProps) {
  if (!children || !children.length || children.length <= 1) {
    throw new Error("Looping List requires at least 2 items");
  }
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<React.RefObject<HTMLDivElement>[]>(
    Array(children.length)
      .fill(null)
      .map(() => React.createRef())
  );

  const computedItemsToShow = Math.min(
    maxItemsToShow || children.length + 1,
    children.length + 1
  );
  const computedMinHeight = itemMinHeight ? itemMinHeight : 100 / computedItemsToShow;
  const handleScroll: UIEventHandler<HTMLDivElement> = useCallback((event) => {
    if (!itemRefs.current || !listRef.current) {
      return;
    }
    const currentRef = itemRefs.current[0];
    if (!currentRef.current) {
      return;
    }
    rotateList();
    const position = listRef.current.scrollTop / currentRef.current.clientHeight;
    console.log("setting current index to", Math.floor(position % children.length));
    setCurrentIndex(Math.floor(position % children.length));
  }, []);
  const centerItem = useCallback(_debounce((index) => {
      console.log("CALLING CENTER_ITEM")
      if (itemRefs.current && listRef.current) {
        const indexRef = itemRefs.current[index];
        if (!indexRef.current) {
          return;
        }
        console.log("scrolling to", index, listRef.current.scrollTop);  
        indexRef.current.scrollIntoView({
          behavior: "auto",
          block: "center",
          inline: "center",
        });
        console.log("done scrolling to", index, listRef.current.scrollTop);  
      }
    }, 250),
    []
  );
  const rotateList = useCallback(_throttle(() => {
    console.log("CALLING ROTATE_LIST")
    if (!itemRefs.current || !listRef.current) {
      return;
    }
    const firstRef = itemRefs.current[0];
    if (!firstRef.current) {
      return;
    }
    const itemHeight = firstRef.current.clientHeight;
    const numItems = children.length;
    const listHeight = itemHeight * (numItems - 1);
    const newHeight = (listRef.current.scrollTop % listHeight) + listHeight;
    if (listRef.current.scrollTop !== newHeight) {
      listRef.current.scrollTo({
        top: newHeight,
        left: listRef.current.scrollLeft,
        behavior: "auto",
      });
    }
  }, 10), []);
  useEffect(() => {
    console.log("calling centerItem on ", currentIndex);
    centerItem(currentIndex);
  }, [currentIndex, centerItem]);
  return (
    <Flex
      overflow="auto"
      ref={listRef}
      flexDirection="column"
      alignItems="center"
      onScroll={handleScroll}
      {...props}
    >
      {children.map((child) => {
        return (
          <Box
            margin="auto"
            key={child.key + "-overflow-top"}
            minHeight={computedMinHeight}
          >
            {child}
          </Box>
        );
      })}
      {children.map((child, index) => {
        return (
          <Box
            margin="auto"
            key={child.key}
            ref={itemRefs.current[index]}
            minHeight={computedMinHeight}
          >
            {child}
          </Box>
        );
      })}
      {children.map((child) => {
        return (
          <Box
            margin="auto"
            key={child.key + "-overflow-bottom"}
            minHeight={computedMinHeight}
          >
            {child}
          </Box>
        );
      })}
    </Flex>
  );
};

// export default forwardRef<LoopingListProps, 'div'>((props , ref) => (
//   <LoopingList {...props as LoopingListProps}/>
// ));
