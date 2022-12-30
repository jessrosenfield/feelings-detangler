import { convertNestedToTieredValues, unpackItems } from "./util";
import enums from "../util/enums.json";

test("unpacks feelings wheel properly", () => {
  const unpackedFeelings = unpackItems({items: enums.feelingsWheelFeelings}, []);
  expect(unpackedFeelings[2][15]).toEqual({
    dims: [1, 3, 1],
    itemsLength: 0,
    value: "insignificant",
  });
  expect(unpackedFeelings[1][7]).toEqual({
    dims: [1, 3, 0],
    itemsLength: 0,
    value: "worried",
  });
});
test("adjusts dims properly", () => {
  convertNestedToTieredValues(enums.feelingsWheelFeelings);
});
