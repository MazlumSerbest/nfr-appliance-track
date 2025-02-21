SELECT
  1 AS id,
  count(
    CASE
      WHEN ((STATUS) :: text = 'order' :: text) THEN 1
      ELSE NULL :: integer
    END
  ) AS "orderCount",
  count(
    CASE
      WHEN ((STATUS) :: text = 'invoice' :: text) THEN 1
      ELSE NULL :: integer
    END
  ) AS "invoiceCount",
  count(
    CASE
      WHEN ((STATUS) :: text = 'purchase' :: text) THEN 1
      ELSE NULL :: integer
    END
  ) AS "purchaseCount",
  count(
    CASE
      WHEN ((STATUS) :: text = 'complete' :: text) THEN 1
      ELSE NULL :: integer
    END
  ) AS "completeCount"
FROM
  "vOrders";