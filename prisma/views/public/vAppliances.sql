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
          LEFT JOIN customers c ON ((a."customerId" = c.id))
        )
        LEFT JOIN dealers d ON ((a."dealerId" = d.id))
      )
      LEFT JOIN dealers sd ON ((a."subDealerId" = sd.id))
    )
    LEFT JOIN suppliers s ON ((a."supplierId" = s.id))
  );