SELECT
  o.id,
  o.status,
  o."registerNo",
  o."invoiceNo",
  o."soldAt",
  o."paymentPlan",
  o.price,
  o.currency,
  o.note,
  o."createdBy",
  o."createdAt",
  o."updatedBy",
  o."updatedAt",
  c.name AS "customerName",
  d.name AS "dealerName",
  sd.name AS "subDealerName",
  s.name AS "supplierName",
  COALESCE(a."serialNo", l."appSerialNo") AS "applianceSerialNo",
  COALESCE(a."productModel", p.model) AS "productModel",
  COALESCE(a."productBrand", pb.name) AS "productBrand",
  (
    (
      (
        ((pb.name) :: text || ' ' :: text) || (lt.type) :: text
      ) || ' ' :: text
    ) || lt.duration
  ) AS "licenseType",
  l."serialNo" AS "licenseSerialNo"
FROM
  (
    (
      (
        (
          (
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
            )
            LEFT JOIN licenses l ON ((o."licenseId" = l.id))
          )
          LEFT JOIN "licenseTypes" lt ON ((l."licenseTypeId" = lt.id))
        )
        LEFT JOIN "vAppliances" a ON ((o."applianceId" = a.id))
      )
      LEFT JOIN products p ON ((a."productId" = p.id))
    )
    LEFT JOIN brands pb ON ((p."brandId" = pb.id))
  );