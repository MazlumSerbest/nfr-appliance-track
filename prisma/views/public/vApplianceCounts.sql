SELECT
  1 AS id,
  count(
    CASE
      WHEN (
        (STATUS = 'stock' :: text)
        AND ("isDemo" = false)
      ) THEN 1
      ELSE NULL :: integer
    END
  ) AS "stockCount",
  count(
    CASE
      WHEN (
        (STATUS = 'order' :: text)
        AND ("isDemo" = false)
      ) THEN 1
      ELSE NULL :: integer
    END
  ) AS "orderCount",
  count(
    CASE
      WHEN (
        (STATUS = 'active' :: text)
        AND ("isDemo" = false)
      ) THEN 1
      ELSE NULL :: integer
    END
  ) AS "activeCount"
FROM
  "vAppliances";