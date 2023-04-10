WITH Ordered_Prices AS (
    SELECT 
      Prices.item_id,
      Prices.store_name,
      Prices.price,
      date(Prices.created_at, 'unixepoch') as created_at,
      ROW_NUMBER() OVER (PARTITION BY Prices.item_id, Prices.store_name ORDER BY Prices.created_at DESC) AS rn
    FROM 
      Prices
)
SELECT 
  i.id, 
  i.name, 
  p1.price AS price1, 
  p1.store_name AS store1, 
  p1.created_at AS timestamp1, 
  p2.price AS price2, 
  p2.store_name AS store2, 
  p2.created_at AS timestamp2
FROM 
  Items i 
  LEFT JOIN Ordered_Prices p1 ON i.id = p1.item_id AND p1.rn = 1
  LEFT JOIN Ordered_Prices p2 ON i.id = p2.item_id AND p1.store_name = p2.store_name AND p2.rn = 2
;

-----------------------------------------

SELECT
  p.id,
  p.item_id,
  p.store_name,
  -- p.price,
  date(p.created_at, 'unixepoch') as created_at,
  MIN(p.price) OVER (PARTITION BY p.item_id, p.created_at ORDER BY p.created_at DESC) AS min_price
FROM
  Prices p
GROUP BY created_at, p.item_id;
-- WHERE
--   p.created_at >=

-----------------------------------------

SELECT
  item_id,
  item_name,
  lowest_price,
  store_name,
  created_at
FROM (
  SELECT
    i.id AS item_id,
    i.name AS item_name,
    p.price AS lowest_price,
    p.store_name AS store_name,
    p.created_at AS created_at
  FROM
    items i
  INNER JOIN (
    SELECT
      date(created_at, 'unixepoch') as created_at,
      item_id,
      store_name,
      MIN(price) AS price
    FROM
      prices
    GROUP BY
      item_id,
      store_name,
      created_at
  ) p ON i.id = p.item_id
  ORDER BY
    p.created_at DESC,
    p.price ASC
  GROUP BY
    p.created_at,
    p.price
)
  ;

-----------------------------------------
