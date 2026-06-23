export function getPagination({ page, limit }) {
  return {
    limit,
    offset: (page - 1) * limit,
  };
}

export function buildPaginationMeta({ count, page, limit }) {
  return {
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
  };
}