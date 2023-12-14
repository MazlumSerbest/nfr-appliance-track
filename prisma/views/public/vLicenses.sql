SELECT
  l.id,
  l."isStock",
  l."startDate",
  l."expiryDate",
  l."boughtType",
  l."boughtAt",
  l."soldAt",
  l."createdBy",
  l."createdAt",
  l."updatedBy",
  l."updatedAt",
  l.deleted,
  lt.type AS "licenseType",
  lt.duration AS "licenseDuration",
  p.model AS "productModel",
  c.name AS "customerName",
  d.name AS "dealerName",
  s.name AS "supplierName",
  CASE
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
            licenses l
            LEFT JOIN "licenseTypes" lt ON ((l."licenseTypeId" = lt.id))
          )
          LEFT JOIN products p ON ((lt."productId" = p.id))
        )
        LEFT JOIN customers c ON ((l."customerId" = c.id))
      )
      LEFT JOIN dealers d ON ((l."dealerId" = d.id))
    )
    LEFT JOIN suppliers s ON ((l."supplierId" = s.id))
  );