SELECT
  a.id,
  CASE
    WHEN (
      (a."customerId" IS NULL)
      AND (a."soldAt" IS NULL)
    ) THEN 'stock' :: text
    WHEN (
      (a."customerId" IS NOT NULL)
      AND (a."soldAt" IS NULL)
    ) THEN 'order' :: text
    WHEN (
      (a."customerId" IS NOT NULL)
      AND (a."soldAt" IS NOT NULL)
    ) THEN 'active' :: text
    ELSE 'order' :: text
  END AS STATUS,
  a."serialNo",
  a."boughtAt",
  a."soldAt",
  a."createdBy",
  a."createdAt",
  a."updatedBy",
  a."updatedAt",
  a.deleted,
  a."isDemo",
  a."productId",
  p.model AS "productModel",
  b.name AS "productBrand",
  c.name AS "customerName",
  d.name AS "dealerName",
  sd.name AS "subDealerName",
  s.name AS "supplierName"
FROM
  (
    (
      (
        (
          (
            (
              appliances a
              LEFT JOIN products p ON ((a."productId" = p.id))
            )
            LEFT JOIN brands b ON ((p."brandId" = b.id))
          )
          LEFT JOIN currents c ON ((a."customerId" = c.id))
        )
        LEFT JOIN currents d ON ((a."dealerId" = d.id))
      )
      LEFT JOIN currents sd ON ((a."subDealerId" = sd.id))
    )
    LEFT JOIN currents s ON ((a."supplierId" = s.id))
  )
WHERE
  (a.deleted = false);