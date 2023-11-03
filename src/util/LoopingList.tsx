import { Box, Flex, FlexProps } from "@chakra-ui/react";
import _debounce from "lodash/debounce";
import _throttle from "lodash/throttle";
import React, { UIEventHandler, useCallback, useEffect, useRef, useState } from "react";

interface LoopingListProps extends FlexProps {
  children?: JSX.Element[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  maxItemsToShow?: number;
  itemMinHeightPixels?: number;
  heightPixels?: number;
  isRecentering: boolean,
  setIsRecentering: (val: boolean) => void;
};

export default function LoopingList({
  children,
  currentIndex,
  setCurrentIndex,
  maxItemsToShow,
  itemMinHeightPixels = 40,
  heightPixels,
  isRecentering,
  setIsRecentering,
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
  const numItems = children.length;
  const computedItemsToShow = Math.min(
    maxItemsToShow || (heightPixels && Math.floor(itemMinHeightPixels/heightPixels)) || children.length,
    children.length
  );
  const computedContainerHeight = heightPixels || computedItemsToShow * itemMinHeightPixels;
  const itemHeight = computedContainerHeight && computedItemsToShow && computedContainerHeight/computedItemsToShow;
  const listHeight = itemHeight * numItems;
  const containerCenterOffset = computedContainerHeight/2 - itemHeight/2;
  const [scrollTop, setScrollTop] = useState(listHeight - containerCenterOffset);

  const rotateList = useCallback(_debounce(() => {
    if (!listRef?.current) {
      return;
    }
    const scrollTop = listRef.current.scrollTop;
    const newHeight = (scrollTop + containerCenterOffset) % listHeight + listHeight - containerCenterOffset;
    if (scrollTop !== newHeight) {
      listRef.current.scrollTo({
        top: newHeight,
        left: listRef.current.scrollLeft,
        behavior: "auto",
      });
    }

    // FIXME: Gradual updates to selected index (to propogate to other tiers) currently
    // does not function properly.
    // console.log("managing scroll")
    return;
    if (isRecentering) {
      // console.log("skipping pos set")
      return;
    }

    const position = (Math.floor((scrollTop - (listHeight - containerCenterOffset)) / itemHeight) + numItems) % numItems;

    if (position === currentIndex) {
      // Minor changes in scrolling should bump to the next item if > .25% change.
      const indexCenteredPosition = currentIndex * itemHeight +listHeight - containerCenterOffset;
      let diff = (scrollTop - indexCenteredPosition) * 2 / itemHeight
      if (Math.abs(diff) > .25) {
        diff = diff > 0 ? 1 : -1;
      } else {
        diff = 0;
      }
      setCurrentIndex((position + diff + numItems)%numItems);

      console.log("setting", {
        newHeight,
        currentIndex,
        position,
        numItems,
      })
    } else {
      console.log("setting big", {
        newHeight,
        currentIndex,
        position,
        numItems,
      })
      setCurrentIndex(position);
    }
  }, 50), [isRecentering]);
  const centerItem = 
    (index: number, smooth=true) => {
      if (itemRefs?.current && listRef?.current) {
        const indexRef = itemRefs.current[index];
        if (!indexRef?.current) {
          return;
        }
        console.log("recentering", index, smooth);
        const indexCenteredPosition = currentIndex * itemHeight +listHeight - containerCenterOffset;
        listRef.current.scrollTo({
          behavior: smooth ? "smooth" : "auto",          
          top: indexCenteredPosition,
          left: listRef.current.scrollLeft,
        });
      }
    };
  useEffect(() => {
    // console.log("received", currentIndex, children[currentIndex].key);
    centerItem(currentIndex);
    setIsRecentering(false);
  }, [currentIndex]);
  useEffect(() => {
    rotateList();
  },[scrollTop]);
  
  const handleScroll: UIEventHandler<HTMLDivElement> = (event) => {
    if (!listRef?.current) {
      return;
    }
    setScrollTop(listRef.current.scrollTop);
  };
  const loadChildren = ({key, hasRef}: {key?: string, hasRef?: boolean}) => {
    return children.map((child, index) => {
      const refArgs: {
        ref?: React.RefObject<HTMLDivElement>
      } = {}
      if (hasRef) {
        refArgs.ref = itemRefs.current[index];
      }
      return (
        <Box
          margin="auto"
          key={key ? `${child.key}-${key}` : child.key}
          style={child.props.style}
          onClick={() => {
            centerItem(index, false);
            setCurrentIndex(index);
          }}
          {...refArgs}
          width="full"
          minHeight={`${itemHeight}px`}
        >
          {child}
        </Box>
      );
    });
  };
  return (
    <Flex
      overflow="auto"
      ref={listRef}
      flexDirection="column"
      alignItems="center"
      onScroll={handleScroll}
      height={computedContainerHeight && `${computedContainerHeight}px`}
    >
      {loadChildren({key: "overflow-top"})}
      {loadChildren({hasRef: true})}
      {loadChildren({key: "overflow-bottom"})}
    </Flex>
  );
};
