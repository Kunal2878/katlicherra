import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSelector,useDispatch } from "react-redux";
import { setCurrentPage } from "../../../Store/slice";

const Pagination = ({
  totalPages,
  onPageChange,
  extraClasses = "",
}) => {


  if (totalPages <= 0) return null;
  
  const renderPaginationButtons = () => {
    const dispatch = useDispatch();
    const currentPage = useSelector((state) => state.userData.CurrentPage);
    const buttons = [];

    // Previous button
    buttons.push(
      <button
        key="prev"
        onClick={() => {
          dispatch(setCurrentPage(Math.max(currentPage - 1, 1)));
          onPageChange(Math.max(currentPage - 1, 1));
        }}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-lg bg-lamaPurpleLight text-purpleColor disabled:opacity-50"
      >
        <ChevronLeft size={20} />
      </button>
    );

    // Always show first page
    buttons.push(
      <button
        key={1}
        onClick={() => {
          dispatch(setCurrentPage(1));
          onPageChange(1);
        }}
        className={`px-3 py-1 rounded-lg ${
          currentPage === 1
            ? "bg-purpleColor text-white"
            : "bg-lamaPurpleLight text-purpleColor"
        }`}
      >
        1
      </button>
    );

    // Show dots or numbers
    if (currentPage > 3) {
      buttons.push(
        <button
          key={2}
          onClick={() => {
            dispatch(setCurrentPage(2));
            onPageChange(2);
          }}
          className="px-3 py-1 rounded-lg bg-lamaPurpleLight text-purpleColor"
        >
          2
        </button>
      );
      buttons.push(
        <span key="dots1" className="px-2 text-purpleColor bg-red-200">
          ...
        </span>
      );
    }

    // Current page and surrounding pages
    if (currentPage !== 1 && currentPage !== totalPages) {
      buttons.push(
        <button
          key={currentPage}
          onClick={() => {
            dispatch(setCurrentPage(currentPage));
            onPageChange(currentPage);
          }}
          className="px-3 py-1 rounded-lg bg-purple-600 text-white"
        >
          {currentPage}
        </button>
      );
    }

    // Show dots before last page
    if (currentPage < totalPages - 2) {
      buttons.push(
        <span key="dots2" className="px-2 text-purpleColor bg-red-200">
          ...
        </span>
      );
      buttons.push(
        <button
          key={totalPages - 1}
          onClick={() => {
            dispatch(setCurrentPage(totalPages - 1));
            onPageChange(totalPages - 1);
          }}
          className="px-3 py-1 rounded-lg bg-purple-100 text-purple-600"
        >
          {totalPages - 1}
        </button>
      );
    }

    // Always show last page
    if (totalPages !== 1) {
      buttons.push(
        <button
          key={totalPages}
          onClick={() => {
            dispatch(setCurrentPage(totalPages));
            onPageChange(totalPages);
          }}
          className={`px-3 py-1 rounded-lg ${
            currentPage === totalPages
              ? "bg-purpleColor text-white"
              : "bg-lamaPurpleLight text-purpleColor"
          }`}
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => {
          dispatch(setCurrentPage(Math.min(currentPage + 1, totalPages)));
          onPageChange(Math.min(currentPage + 1, totalPages));
        }}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-lg bg-lamaPurpleLight text-purpleColor disabled:opacity-50"
      >
        <ChevronRight size={20} />
      </button>
    );

    return buttons;
  };

  return (
    <div className={`flex justify-center items-center py-4 ${extraClasses}`}>
      <div className="flex items-center justify-center space-x-2">
     {renderPaginationButtons()}
      </div>
    </div>
  );
};

export default Pagination;
