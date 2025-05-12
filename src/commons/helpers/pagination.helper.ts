export function paginationHelper(
  currPage: number,
  dataPerPage: number,
  dataCount: number,
) {
  const offset = (currPage - 1) * dataPerPage;
  const totalCount = dataCount;
  const totalPage = Math.ceil(totalCount / dataPerPage);

  return {
    offset,
    totalCount,
    totalPage,
  };
}
