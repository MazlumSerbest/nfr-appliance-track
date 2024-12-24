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
      WHEN (STATUS = 'waiting' :: text) THEN 1
      ELSE NULL :: integer
    END
  ) AS "waitingCount",
  count(
    CASE
      WHEN (STATUS = 'active' :: text) THEN 1
      ELSE NULL :: integer
    END
  ) AS "activeCount",
  count(
    CASE
      WHEN (STATUS = 'lost' :: text) THEN 1
      ELSE NULL :: integer
    END
  ) AS "lostCount",
  count(
    CASE
      WHEN (STATUS = 'passive' :: text) THEN 1
      ELSE NULL :: integer
    END
  ) AS "passiveCount",
  count(
    CASE
      WHEN ("expiryStatus" = 'undefined' :: text) THEN 1
      ELSE NULL :: integer
    END
  ) AS "undefinedCount",
  count(
    CASE
      WHEN ("expiryStatus" = 'ended' :: text) THEN 1
      ELSE NULL :: integer
    END
  ) AS "endedCount",
  count(
    CASE
      WHEN ("expiryStatus" = 'ending' :: text) THEN 1
      ELSE NULL :: integer
    END
  ) AS "endingCount",
  count(
    CASE
      WHEN ("expiryStatus" = 'continues' :: text) THEN 1
      ELSE NULL :: integer
    END
  ) AS "continuesCount"
FROM
  "vLicenses";