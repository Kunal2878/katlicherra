  import { useState, useEffect } from 'react';
  import { Search, Trash2, PenSquare, X, Loader, ChevronLeft, ChevronRight } from 'lucide-react';
  import axios from 'axios'
  import {GetAllComplaints,DeleteComplaint} from "../../Route"
  const AllComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const url = import.meta.env.VITE_API_BASE_URL;
    useEffect(() => {
      document.title = "View Complaints";
  }, []);
    useEffect(() => {
      fetchComplaints();
    }, [currentPage, searchQuery, statusFilter]);

    const fetchComplaints = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(`${url}${GetAllComplaints}`);
        setComplaints(data.data.complaints);
        setTotalPages(data.data.pagination.totalPages);
      } catch (error) {
        console.error('Error fetching complaints:', error);
        setError('No complaints found');
      } finally {
        setLoading(false);
      }
    };

    const handleDeleteComplaint = async (complaintId) => {
      try {
        await axios.post(`${url}${DeleteComplaint}/:${complaintId}`);
        // Refresh the complaints list after successful deletion
        fetchComplaints();
      } catch (error) {
        console.error('Error deleting complaint:', error);
        setError('Failed to delete complaint. Please try again later.');
      }
    };

    const renderPaginationButtons = () => {
      const buttons = [];

      // Previous button
      buttons.push(
        <button
          key="prev"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-lg bg-lamaPurpleLight text-purpleColor disabled:opacity-50"
        >
          <ChevronLeft size={20} />
        </button>
      );

      // First page
      buttons.push(
        <button
          key={1}
          onClick={() => setCurrentPage(1)}
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
            onClick={() => setCurrentPage(2)}
            className="px-3 py-1 rounded-lg bg-lamaPurpleLight text-purpleColor"
          >
            2
          </button>
        );
        buttons.push(
          <span key="dots1" className="px-2">
            ...
          </span>
        );
      }

      // Current page neighborhood
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        if (i <= currentPage + 1) {
          buttons.push(
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`px-3 py-1 rounded-lg ${
                currentPage === i
                  ? "bg-purpleColor text-white"
                  : "bg-lamaPurpleLight text-purpleColor"
              }`}
            >
              {i}
            </button>
          );
        }
      }

      // Show dots before last page
      if (currentPage < totalPages - 2) {
        buttons.push(
          <span key="dots2" className="px-2">
            ...
          </span>
        );
      }

      // Last page
      if (totalPages > 1) {
        buttons.push(
          <button
            key={totalPages}
            onClick={() => setCurrentPage(totalPages)}
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
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-lg bg-lamaPurpleLight text-purpleColor disabled:opacity-50"
        >
          <ChevronRight size={20} />
        </button>
      );

      return buttons;
    };

    return (
      <div className="sm:px-16 px-6 sm:py-16 py-10 min-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row text-black justify-between items-start md:items-center mb-[32px] p-2">
          <div className="mb-4 md:mb-0">
            <h2 className="h2 mb-2">All Complaints</h2>
            <div className="flex items-center subtitle-2">
              <span className="">Complaints / </span>
              <span>All Complaints</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-2 rounded-md shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mt-[16px] mb-[32px] bg-white">
            <div className="relative flex-1 max-w-md text-black p-2 ml-4">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 w-full pl-10 pr-4 py-2 border rounded-lg bg-lamaSkyLight text-black-300 transition-all duration-200"
              />
            </div>

            <div className="flex gap-4 mr-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-2 border rounded-lg bg-primary-300 text-black-300 border-lamaSkyLight transition-all duration-200"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto text-black-300 text-base bg-white m-4">
            {loading && (
              <div className="flex items-center justify-center p-8">
                <Loader className="animate-spin h-8 w-8 text-purpleColor" />
              </div>
            )}

            <table className="w-full min-w-[768px] pb-10">
              <thead className="">
                <tr className="border-b bg-lamaPurpleLight">
                  <th className="px-6 py-4 text-left">Student's Name</th>
                  <th className="px-6 py-4 text-left">Class</th>
                  <th className="px-6 py-4 text-left">Class Teacher</th>
                  <th className="px-6 py-4 text-left">Description</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? null : error ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-red-700">{error}</td>
                  </tr>
                ) : complaints.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center">No complaints available</td>
                  </tr>
                ) : (
                  complaints.map((complaint) => (
                    <tr
                      key={complaint._id}
                      className="border-b hover:bg-gray-50 transition-colors duration-150 animate-fade-in"
                    >
                      <td className="px-6 py-4">{complaint.name.name}</td>
                      <td className="px-6 py-4">
                        {complaint.name.studentClass.className} {complaint.name.studentClass.section}
                      </td>
                      <td className="px-6 py-4">
                        {complaint.name.studentClass.classTeacher.name}
                      </td>
                      <td className="px-6 py-4">{complaint.description}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full ${
                            complaint.status === 'resolved'
                              ? 'bg-success-100 text-success-700'
                              : complaint.status === 'rejected'
                              ? 'bg-danger-100 text-danger-700'
                              : 'bg-warning-100 text-warning-700'
                          }`}
                        >
                          {complaint.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-start gap-2">
                          <button 
                            onClick={() => handleDeleteComplaint(complaint._id)}
                            className="p-1 hover:text-danger transition-colors duration-200 transform hover:scale-110">
                            <Trash2 size={18} />
                          </button>
                          <button className="p-1 hover:text-purpleColor transition-colors duration-200 transform hover:scale-110">
                            <PenSquare size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="bottom-0 left-0 right-0 flex justify-center items-center py-4">
          <div className="flex items-center justify-center space-x-2">
            {renderPaginationButtons()}
          </div>
        </div>
      </div>
    );
  };

  export default AllComplaints;