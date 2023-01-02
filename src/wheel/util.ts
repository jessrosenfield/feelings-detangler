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
