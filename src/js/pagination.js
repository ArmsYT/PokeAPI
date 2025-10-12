export const pageState = { pageSize: 25, currentPage: 1 };

export function setPageSize(v){ pageState.pageSize = v; }
export function setCurrentPage(v){ pageState.currentPage = v; }

export function totalPages(dataset){
  if (pageState.pageSize === -1){ return 1; }
  return Math.max(1, Math.ceil(dataset.length / pageState.pageSize));
}

export function sliceForCurrentPage(dataset){
  if (pageState.pageSize === -1){ return dataset; }
  const start = (pageState.currentPage - 1) * pageState.pageSize;
  return dataset.slice(start, start + pageState.pageSize);
}

export function wirePagination({ getDataset, render }){
  const sel = document.querySelector("#pageSize");
  const prev = document.querySelector("#prev");
  const next = document.querySelector("#next");

  if (sel){
    sel.addEventListener("change", () => {
      setPageSize(parseInt(sel.value, 10));
      setCurrentPage(1);
      render();
    });
  }

  if (prev){
    prev.addEventListener("click", () => {
      setCurrentPage(Math.max(1, pageState.currentPage - 1));
      render();
    });
  }

  if (next){
    next.addEventListener("click", () => {
      const tp = totalPages(getDataset());
      setCurrentPage(Math.min(tp, pageState.currentPage + 1));
      render();
    });
  }
}
