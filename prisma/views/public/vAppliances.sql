SELECT
  a.id,
  CASE
    WHEN (
      (a."customerId" IS NULL)
      AND (((a."cusName") :: text = '' :: text) IS NOT FALSE)
      AND (a."soldAt" IS NULL)
    ) THEN 'stock' :: text
    WHEN (
      (
        (a."customerId" IS NOT NULL)
        OR (a."cusName" IS NOT NULL)
      )
      AND (a."soldAt" IS NULL)
    ) THEN 'order' :: text
    WHEN (
      (
        (a."customerId" IS NOT NULL)
        OR (a."cusName" IS NOT NULL)
      )
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
  (((b.name) :: text || ' ' :: text) || (p.model) :: text) AS product,
  p.model AS "productModel",
  b.name AS "productBrand",
  CASE
    WHEN (
      (c.name IS NOT NULL)
      AND (a."cusName" IS NOT NULL)
      AND ((a."cusName") :: text <> '' :: text)
    ) THEN (
      (
        (
          ((c.name) :: text || '(' :: text) || (a."cusName") :: text
        ) || ')' :: text
      )
    ) :: character varying
    WHEN (c.name IS NULL) THEN a."cusName"
    ELSE c.name
  END AS "customerName",
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