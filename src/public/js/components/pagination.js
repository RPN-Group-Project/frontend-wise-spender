const pagination = (metadata) => {
  const { page, totalPages } = metadata;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  if (totalPages > 1) {
    return `
      <ul  class="flex">
        <li data-value="${page === 1 ? 1 : page - 1}" >
          <button
            class="mx-1 flex h-9 w-9 items-center justify-center rounded-full border border-blue-gray-100 bg-transparent p-0 text-sm text-blue-gray-500 transition duration-150 ease-in-out hover:bg-light-300"
            aria-label="Previous"
          >
            <span class="material-icons text-sm">
              <ion-icon name="arrow-back-outline"></ion-icon>
            </span>
          </button>
        </li>
        ${pages
          .map(
            (p) => `
          <li  data-value="${p}"  class="pagination-item" ">
            <button
          
              class="mx-1 flex h-9 w-9 items-center justify-center rounded-full ${
                p === page
                  ? "bg-gradient-to-tr from-pink-600 to-pink-400 text-white shadow-md shadow-pink-500/20"
                  : "border border-blue-gray-100 bg-transparent text-blue-gray-500 hover:bg-light-300"
              } p-0 text-sm transition duration-150 ease-in-out"
            >
              ${p}
            </button>
          </li>
        `
          )
          .join("")}
        <li data-value="${page === totalPages ? totalPages : page + 1}">
          <button
            class="mx-1 flex h-9 w-9 items-center justify-center rounded-full border border-blue-gray-100 bg-transparent p-0 text-sm text-blue-gray-500 transition duration-150 ease-in-out hover:bg-light-300"
            aria-label="Next"
          >
            <span class="material-icons text-sm">
              <ion-icon name="arrow-forward-outline"></ion-icon>
            </span>
          </button>
        </li>
      </ul>
    `;
  }
  return "";
};

export default pagination;
