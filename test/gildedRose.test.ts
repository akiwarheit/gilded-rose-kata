import { GildedRose } from "../gildedRose";

describe("Gilded Rose System Introduction", () => {
  const instance = new GildedRose();

  instance.addItem({ name: "Foo", sellIn: 10, quality: 5 });
  instance.addItem({ name: "Bar", sellIn: 10, quality: 5 });

  const items = instance.items;

  test("All items have a SellIn value which denotes the number of days we have to sell the item", () => {
    items.forEach((element) => {
      expect(element).toHaveProperty("sellIn");
    });
  });

  test("All items have a Quality value which denotes how valuable the item is", () => {
    items.forEach((element) => {
      expect(element).toHaveProperty("quality");
    });
  });

  test("At the end of each day our system lowers both values for every item", () => {
    instance.endOfDay();
    const newItems = instance.items;
    newItems.forEach((item) => {
      expect(item.quality).toEqual(4);
    });
  });
});

describe("Gilded Rose Update Rules", () => {
  const instance = new GildedRose();

  instance.addItem({ name: "Foo", sellIn: 0, quality: 5 });
  instance.addItem({ name: "Bar", sellIn: 10, quality: 0 });
  instance.addItem({ name: "Aged Brie", sellIn: 10, quality: 0 });
  instance.addItem({ name: "Above 50 Item", sellIn: 10, quality: 69 });
  instance.addItem({ name: "Sulfuras", sellIn: 10, quality: 80 });

  instance.addItem({ name: "Backstage pass", sellIn: 10, quality: 10 });

  instance.endOfDay();

  const items = instance.items;
  test("Once the sell by date has passed, Quality degrades twice as fast", () => {
    expect(items[0].quality).toEqual(3);
  });

  test("The Quality of an item is never negative", () => {
    expect(items[1].quality).toBeGreaterThanOrEqual(0);
  });

  test("'Aged Brie' actually increases in Quality the older it gets", () => {
    expect(items[2].quality).toBeGreaterThanOrEqual(1);
  });

  test("The Quality of an item is never more than 50", () => {
    items.forEach((item) => {
      if (item.name !== "Sulfuras") {
        expect(item.quality).toBeLessThanOrEqual(50);
      }
    });
  });

  test("'Sulfuras', being a legendary item, never has to be sold or decreases in Quality", () => {
    expect(items[3].quality).toEqual(80); // doesn't change
    expect(items[3].sellIn).toEqual(10); // doesn't go down
  });

  test("'Backstage passes', like aged brie, increases in Quality as its SellIn value approaches", () => {
    // Increase By 1
    const gildedRose = new GildedRose([
      { name: "Backstage passes", sellIn: 11, quality: 1 },
    ]);
    gildedRose.endOfDay();
    const items = gildedRose.items;
    const added = items[0];
    expect(added.quality).toEqual(2);
    expect(added.sellIn).toEqual(10);
  });

  test("'Backstage passes' increases by 2 when there are 10 days or less", () => {
    // Increase By 2
    const gildedRose = new GildedRose([
      { name: "Backstage passes", sellIn: 6, quality: 1 },
    ]);
    gildedRose.endOfDay();
    const items = gildedRose.items;
    const added = items[0];
    expect(added.quality).toEqual(3);
    expect(added.sellIn).toEqual(5);
  });

  test("'Backstage passes' increases by 3 when there are 5 days or less", () => {
    // Increase By 3
    const gildedRose = new GildedRose([
      { name: "Backstage passes", sellIn: 5, quality: 1 },
    ]);
    gildedRose.endOfDay();
    const items = gildedRose.items;
    const added = items[0];
    expect(added.quality).toEqual(4);
    expect(added.sellIn).toEqual(4);
  });

  test("'Backstage passes' Quality drops to 0 after the concert", () => {
    const gildedRose = new GildedRose([
      {
        name: "Backstage passes",
        sellIn: 0,
        quality: 10,
      },
    ]);
    gildedRose.endOfDay();
    const items = gildedRose.items;
    const added = items[0];
    expect(added.quality).toEqual(0);
    expect(added.sellIn).toEqual(-1);
  });

  test("'Conjured' items degrade in Quality twice as fast as normal items", () => {
    const gildedRose = new GildedRose([
      {
        name: "Conjured",
        sellIn: 10,
        quality: 10,
      },
    ]);
    gildedRose.endOfDay();
    const items = gildedRose.items;
    const added = items[0];
    expect(added.quality).toEqual(8);
    expect(added.sellIn).toEqual(9);
  });
});
