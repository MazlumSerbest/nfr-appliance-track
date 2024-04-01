SELECT
  l.id,
  CASE
    WHEN (
      (l."customerId" IS NULL)
      AND (l."orderedAt" IS NULL)
      AND (l."expiryDate" IS NULL)
    ) THEN 'stock' :: text
    WHEN (
      (l."customerId" IS NOT NULL)
      AND (l."orderedAt" IS NULL)
      AND (l."expiryDate" IS NULL)
    ) THEN 'order' :: text
    WHEN (
      (l."customerId" IS NOT NULL)
      AND (l."orderedAt" IS NOT NULL)
      AND (l."expiryDate" IS NULL)
    ) THEN 'waiting' :: text
    WHEN (l."expiryDate" IS NOT NULL) THEN 'active' :: text
    ELSE 'waiting' :: text
  END AS STATUS,
  l."serialNo",
  l."startDate",
  l."expiryDate",
  l."boughtAt",
  l."soldAt",
  l."orderedAt",
  l."createdBy",
  l."createdAt",
  l."updatedBy",
  l."updatedAt",
  l.deleted,
  l."appSerialNo",
  COALESCE(a."serialNo", l."appSerialNo") AS "applianceSerialNo",
  a.product,
  a."productModel",
  a."productBrand",
  (
    (
      (((b.name) :: text || ' ' :: text) || (lt.type) :: text) || ' ' :: text
    ) || lt.duration
  ) AS "licenseType",
  bt.type AS "boughtType",
  c.name AS "customerName",
  d.name AS "dealerName",
  sd.name AS "subDealerName",
  s.name AS "supplierName",
  CASE
    WHEN (l."expiryDate" IS NULL) THEN 'undefined' :: text
    WHEN (l."expiryDate" < CURRENT_DATE) THEN 'ended' :: text
    WHEN (
      l."expiryDate" <= (CURRENT_DATE + '30 days' :: INTERVAL)
    ) THEN 'ending' :: text
    ELSE 'continues' :: text
  END AS "expiryStatus"
FROM
  (
    (
      (
        (
          (
            (
              (
                (
                  licenses l
                  LEFT JOIN "vAppliances" a ON ((l."applianceId" = a.id))
                )
                LEFT JOIN "licenseTypes" lt ON ((l."licenseTypeId" = lt.id))
              )
              LEFT JOIN "boughtTypes" bt ON ((l."boughtTypeId" = bt.id))
            )
            LEFT JOIN brands b ON ((lt."brandId" = b.id))
          )
          LEFT JOIN currents c ON ((l."customerId" = c.id))
        )
        LEFT JOIN currents d ON ((l."dealerId" = d.id))
      )
      LEFT JOIN currents sd ON ((l."subDealerId" = sd.id))
    )
    LEFT JOIN currents s ON ((l."supplierId" = s.id))
  )
WHERE
  (l.deleted = false);