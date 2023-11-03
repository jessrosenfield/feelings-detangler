import _concat from "lodash/concat";
import _zip from "lodash/zip";

export type TieredValue = {
  value: string;
  dims: number[];
  itemsLength: number;
}

export type NestedValue = {
  value?: string,
  items?: NestedValue[]|string[],
}

export function convertNestedToTieredValues(root: NestedValue[]) {
  const unpacked = unpackItems({items: root}, []);

  const cumLengths = unpacked.map(tier => {
    const cumSum: number[] = [];
    const tierLengths = tier.map(tier => tier.itemsLength);
    tierLengths.reduce((acc, val, ind) => cumSum[ind] = acc + val, 0)
    return cumSum;
  });
  // console.log(unpacked, cumLengths, unpacked.map(tier => tier.length));
  return unpacked.map((tier, tierIndex) => {
    return tier.map((item, itemIndex) => {
      const paddedDims = item.dims.concat(Array(unpacked.length).fill(0)).slice(0, unpacked.length);
      const newDims = [...paddedDims];
      newDims.forEach((dim, dimIndex) => {
        let newDim = dim;
        if (dimIndex === tierIndex) {
          newDim = itemIndex;
        }
        if (dimIndex > 0 && newDims[dimIndex-1] > 0) {
          newDim = cumLengths[dimIndex-1][newDims[dimIndex-1]-1] + dim;
        }
        newDims[dimIndex] = newDim;
      });
      // if (tierIndex === 0 && itemIndex == 3) {
      //  console.log({new: newDims, orig: item.dims}) 
      // }
      return {...item, dims: newDims};
    });
  });
}

export function unpackItems(item: NestedValue | string, dims: number[]): TieredValue[][] {
  const baseCase = typeof item === 'string';
  if (baseCase) {
    return [[{
      value: item, dims, itemsLength: 0,
    }]]
  }
  const values = (item.items ||[]).map((subItem, index) => unpackItems(subItem, [...dims, index]));
  const zippedValues = _zip(...values).map(item => _concat(...(_concat(...item))));
  const result = [];
  if (item?.value) {
    result.push([{
      value: item.value, dims, itemsLength: (item.items || []).length,
    }]);
  }
  return [...result, ...zippedValues as any];
}
