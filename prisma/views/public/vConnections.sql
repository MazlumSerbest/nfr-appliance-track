SELECT
  c.id,
  c.ip,
  c.login,
  c.password,
  c.note,
  c."createdBy",
  c."createdAt",
  c."updatedBy",
  c."updatedAt",
  cu.name AS "customerName",
  b.name AS "brandName"
FROM
  (
    (
      connections c
      LEFT JOIN currents cu ON ((c."customerId" = cu.id))
    )
    LEFT JOIN brands b ON ((c."brandId" = b.id))
  );