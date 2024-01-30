SELECT
  a.id,
  a."serialNo",
  a."boughtAt",
  a."soldAt",
  a."createdBy",
  a."createdAt",
  a."updatedBy",
  a."updatedAt",
  a.deleted,
  a."productId",
  CASE
    WHEN (a."customerId" IS NULL) THEN TRUE
    ELSE false
  END AS "isStock",
  p.model AS "productModel",
  p.brand AS "productBrand",
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
            appliances a
            LEFT JOIN products p ON ((a."productId" = p.id))
          )
          LEFT JOIN currents c ON ((a."customerId" = c.id))
        )
        LEFT JOIN currents d ON ((a."dealerId" = d.id))
      )
      LEFT JOIN currents sd ON ((a."subDealerId" = sd.id))
    )
    LEFT JOIN currents s ON ((a."supplierId" = s.id))
  );