SELECT
  1 AS id,
  count(
    CASE
      WHEN ((STATUS) :: text = 'active' :: text) THEN 1
      ELSE NULL :: integer
    END
  ) AS "activeCount",
  count(
    CASE
      WHEN ((STATUS) :: text = 'won' :: text) THEN 1
      ELSE NULL :: integer
    END
  ) AS "winCount",
  count(
    CASE
      WHEN ((STATUS) :: text = 'lost' :: text) THEN 1
      ELSE NULL :: integer
    END
  ) AS "lostCount"
FROM
  "vProjects";