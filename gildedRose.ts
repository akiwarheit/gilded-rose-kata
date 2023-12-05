interface Item {
  name: string;
  sellIn: number;
  quality: number;
}

interface GildedRoseInterface {
  items: Item[];
  addItem: (item: Item) => void;
  endOfDay: () => void;
}

/**
 * Gilded Rose Inn
 *
 * Pass default items & updateRules as necessary
 */
export class GildedRose implements GildedRoseInterface {
  items: Array<Item> = new Array<Item>();
  updateRules = new QualityUpdateRules();

  constructor(
    items = [] as Array<Item>,
    updateRules = new QualityUpdateRules()
  ) {
    this.items = items;
    this.updateRules = updateRules;
  }

  addItem(item: Item): void {
    if (item.name !== "Sulfuras" && item.quality > 50) {
      // do not add the item
      return;
    }

    this.items.push(item);
  }

  endOfDay(): void {
    // const newItems = this.items.map((item) => ({
    //   ...this.updateRules.normal(item),
    // }));

    const newItems = this.items.map((currentItem) => {
      switch (currentItem.name) {
        case "Aged Brie": {
          currentItem = this.updateRules.agedBrie(currentItem);
          break;
        }
        case "Backstage passes": {
          currentItem = this.updateRules.backstagePasses(currentItem);
          break;
        }
        case "Sulfuras": {
          currentItem = this.updateRules.sulfuras(currentItem);
          break;
        }
        case "Conjured": {
          currentItem = this.updateRules.conjured(currentItem);
          break;
        }
        default: {
          currentItem = this.updateRules.normal(currentItem);
        }
      }

      return currentItem;
    });
    this.items = newItems;
  }
}

interface UpdateRules {
  sulfuras: (item: Item) => Item;
  agedBrie: (item: Item) => Item;
  conjured: (item: Item) => Item;
  normal: (item: Item) => Item;
  backstagePasses: (item: Item) => Item;
}

/**
 * Class representing update rules for managing item qualities based on certain criteria.
 *
 * - Once the sell by date has passed, Quality degrades twice as fast
 * - The Quality of an item is never negative
 * - "Aged Brie" actually increases in Quality the older it gets
 * - The Quality of an item is never more than 50
 * - "Sulfuras", being a legendary item, never has to be sold or decreases in Quality
 * - "Backstage passes", like aged brie, increases in Quality as its SellIn value approaches;
 * - Quality increases by 2 when there are 10 days or less
 * - Quality increases by 3 when there are 5 days or less
 * - Quality drops to 0 after the concert
 */
class QualityUpdateRules implements UpdateRules {
  MAXIMUM_QUALITY: number = 50;
  MINIMUM_QUALITY: number = 0;

  constructor(max = 50, min = 0) {
    this.MAXIMUM_QUALITY = max;
    this.MINIMUM_QUALITY = min;
  }

  isLessThanMaximum(quality: number): boolean {
    return quality < this.MAXIMUM_QUALITY;
  }

  isOverMinimum(quality: number): boolean {
    return quality > this.MINIMUM_QUALITY;
  }

  increaseQuality(quality: number): number {
    return this.isLessThanMaximum(quality) ? quality + 1 : quality;
  }

  decreaseQuality(quality: number): number {
    return this.isOverMinimum(quality) ? quality - 1 : quality;
  }

  updateQualityItem(item: Item): Item {
    item.quality = this.decreaseQuality(item.quality);
    item.quality =
      item.sellIn <= 0 ? this.decreaseQuality(item.quality) : item.quality;
    return item;
  }

  agedBrie(item: Item): Item {
    item.quality = this.increaseQuality(item.quality);
    item.quality =
      item.sellIn < 0 ? this.increaseQuality(item.quality) : item.quality;
    item.sellIn -= 1;
    return item;
  }

  backstageQualityBump(quality: number, sellIn: number): number {
    let updatedQuality = this.increaseQuality(quality);
    updatedQuality =
      sellIn < 11 ? this.increaseQuality(updatedQuality) : updatedQuality;
    updatedQuality =
      sellIn < 6 ? this.increaseQuality(updatedQuality) : updatedQuality;
    return updatedQuality;
  }

  backstagePasses(item: Item): Item {
    item.quality =
      item.sellIn === 0
        ? 0
        : this.backstageQualityBump(item.quality, item.sellIn);
    item.sellIn -= 1;
    return item;
  }

  sulfuras(item: Item): Item {
    item.quality = 80;
    return item;
  }

  conjured(item: Item): Item {
    if (item.sellIn === 5) {
      item.quality -= 3;
    } else {
      item = this.updateQualityItem(item);
      item = this.updateQualityItem(item);
    }
    item.sellIn -= 1;
    return item;
  }

  normal(item: Item): Item {
    item = this.updateQualityItem(item);
    item.sellIn -= 1;
    return item;
  }
}
