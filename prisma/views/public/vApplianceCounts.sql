SELECT
  1 AS id,
  count(
    CASE
      WHEN (STATUS = 'stock' :: text) THEN 1
      ELSE NULL :: integer
    END
  ) AS "stockCount",
  count(
    CASE
      WHEN (STATUS = 'order' :: text) THEN 1
      ELSE NULL :: integer
    END
  ) AS "orderCount",
  count(
    CASE
      WHEN (STATUS = 'active' :: text) THEN 1
      ELSE NULL :: integer
    END
  ) AS "activeCount"
FROM
  "vAppliances";