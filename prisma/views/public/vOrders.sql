SELECT
  o.id,
  o.status,
  o."registerNo",
  o."invoiceNo",
  o.expiry,
  o.note,
  o."createdBy",
  o."createdAt",
  o."updatedBy",
  o."updatedAt",
  c.name AS "customerName",
  d.name AS "dealerName",
  sd.name AS "subDealerName",
  s.name AS "supplierName"
FROM
  (
    (
      (
        (
          orders o
          LEFT JOIN currents c ON ((o."customerId" = c.id))
        )
        LEFT JOIN currents d ON ((o."dealerId" = d.id))
      )
      LEFT JOIN currents sd ON ((o."subDealerId" = sd.id))
    )
    LEFT JOIN currents s ON ((o."supplierId" = s.id))
  );