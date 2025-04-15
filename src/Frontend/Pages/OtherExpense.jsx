
import { useState, useEffect } from "react";
import Toast from "../Components/Toast";
import Cookies from "js-cookie";
import { X, Plus, Loader, Search, ChevronDown,Calendar } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { setOtherExpenseData,setShowConfirmationModel,setStatus, setAddText } from "../../Store/slice";
import { useForm } from "react-hook-form";
import { AddOtherExpenseAPI, GetOtherExpenseAPI, DeleteOtherExpenseByIDAPI } from '../../service/api';
import Confirmation from "../Components/Elements/ConfirmationModel"
const OtherExpenses = () => {
  const token = Cookies.get("token");
  const url = import.meta.env.VITE_API_BASE_URL;
  const dispatch = useDispatch();
  const showConfirmation = useSelector((state) => state.userData.showConfirmationModel);
  const confirmRequest = useSelector((state) => state.userData.confirmRequest);
  const expenses = useSelector((state) => state.userData.OtherExpenseData);

  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedExpenses, setSelectedExpenses] = useState([]);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastIcon, setToastIcon] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [currentYear] = useState(new Date().getFullYear());

  // Months array for filter
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // React Hook Form for Expenses
  const { 
    register: registerExpense, 
    handleSubmit: handleSubmitExpense, 
    reset: resetExpense,
    formState: { errors: expenseErrors }
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      amount: ""
    }
  });

  useEffect(() => {
    fetchExpenses();
    document.title = "Other Expenses";
  }, []);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Apply filters when expenses, searchTerm, or selectedMonth changes
  useEffect(() => {
    if (Array.isArray(expenses)) {
      let filtered = [...expenses];

      // Filter by name if searchTerm exists
      if (searchTerm) {
        filtered = filtered.filter(expense => 
          expense.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Filter by month if selectedMonth exists
      if (selectedMonth) {
        const monthIndex = months.findIndex(m => m === selectedMonth);
        filtered = filtered.filter(expense => {
          const expenseDate = new Date(expense.createdAt);
          return expenseDate.getMonth() === monthIndex && expenseDate.getFullYear() === currentYear;
        });
      }

      // Sort by date (newest first)
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setFilteredExpenses(filtered);
    }
  }, [expenses, searchTerm, selectedMonth, currentYear]);

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      const response = await GetOtherExpenseAPI(url);
      if (response.status === 200 || response.status === 204 || response.status === 201) {
        dispatch(setOtherExpenseData(response.data.expenses));
      } else {
        setToastMessage(response.message);
        setToastIcon("wrong");
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage("Failed to fetch expenses");
      setToastIcon("wrong");
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  const onExpenseSubmit = async (data) => {
    setIsLoading(true);

      const response = await AddOtherExpenseAPI(url, data, token);
      if (response.status === 200 || response.status === 201 || response.status === 204) {
        await fetchExpenses();
        resetExpense();
        setToastMessage(response.message);
        setToastIcon("right");
        setShowExpenseForm(false);
      } else {
        setToastMessage(response.message);
        setToastIcon("wrong");
        if (response.status === 401) {  
          Cookies.remove('user');
          Cookies.remove('token');
          window.location.href = '/user-options';                      
        }
      }
      setIsLoading(false);
    
  };

  const handleExpenseSelection = (expenseId) => {
    setSelectedExpenses((prev) =>
      prev.includes(expenseId)
        ? prev.filter((id) => id !== expenseId)
        : [...prev, expenseId]
    );
  };

  const handleDeleteExpenses = async () => {
    if (selectedExpenses.length === 0) return;
    dispatch(setShowConfirmationModel(true));
  };


  const DeleteExpenses = async () => {
    try {
      // Process one by one since API requires individual expense ID
      for (const expenseId of selectedExpenses) {
        await DeleteOtherExpenseByIDAPI(url, expenseId, token);
      }
      
      await fetchExpenses();
      setSelectedExpenses([]);
      dispatch(setStatus("success"))
      dispatch(setAddText(`Expenses deleted successfully`))
      
    } catch (error) {
      dispatch(setStatus("error"))
      dispatch(setAddText(`Failed to  delete Expenses`))
    } 
    
    finally {
      setShowToast(true);
      setIsLoading(false);
      setTimeout(() => {
        dispatch(setStatus(''));
        dispatch(setAddText(''));
        dispatch(setShowConfirmationModel(false));
      }, 3000);
    }
  }

  useEffect( ()=>{
    if(confirmRequest)
      {
      DeleteExpenses()
      }
  },[confirmRequest])


  const handleMonthSelect = (month) => { 
    setSelectedMonth(month === selectedMonth ? "" : month);
    setShowMonthDropdown(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex items-center justify-center h-96">
          <Loader className="h-12 w-12 animate-spin text-purpleColor" />
        </div>
      </div>
    );
  }

  // Calculate total expenses for filtered expenses
  const totalFilteredExpenses = filteredExpenses.length > 0
    ? filteredExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0)
    : 0;

    const ExpenseFormModal = () => {
      // Clone the showExpenseForm state for animation control
      const [isVisible, setIsVisible] = useState(false);
      
      // Watch for changes in the parent component's showExpenseForm state
    
    
      const handleClose = () => {
        setShowExpenseForm(false);
        resetExpense();
      };
    
      return (
        <div className="min-h-full max-w-3xl flex items-center justify-center p-6">
      <div className="h-full w-full space-y-12 bg-white">
           
              <h2 className="h2 mb-[32px] text-left text-black-300">Add Expense</h2>
    
              {/* Expense Form with React Hook Form */}
              <form onSubmit={handleSubmitExpense(onExpenseSubmit)} className="mb-[16px]">
                <div className="mb-4 relative w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
                  <input
                    type="text"
                    placeholder="Expense Name"
                    className={`w-full p-2 rounded bg-transparent border-2 border-black-200 text-black-300 focus:outline ${expenseErrors.name ? 'border-red-500' : ''}`}
                    {...registerExpense("name", { required: "Name is required" })}
                  />
                  {expenseErrors.name && <p className="text-danger text-sm mt-1">{expenseErrors.name.message}</p>}
                </div>
                
                <div className="mb-4 relative w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto ">
                  <textarea
                    placeholder="Description"
                    className={`w-full h-32 p-2 border-2 rounded bg-transparent border-black-200 text-black-300 focus:outline resize-none ${expenseErrors.description ? 'border-red-500' : ''}`}
                    {...registerExpense("description", { required: "Description is required" })}
                  />
                  {expenseErrors.description && <p className="text-danger text-sm mt-1">{expenseErrors.description.message}</p>}
                </div>
                
                <div className="mb-4 relative w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
                  <input
                    type="number"
                    placeholder="Amount"
                    className={`w-full p-2 border-2 rounded bg-transparent border-black-200 text-black-300 focus:outline ${expenseErrors.amount ? 'border-red-500' : ''}`}
                    {...registerExpense("amount", { 
                      required: "Amount is required",
                      min: { value: 1, message: "Amount must be greater than 0" }
                    })}
                  />
                  {expenseErrors.amount && <p className="text-danger text-sm mt-1">{expenseErrors.amount.message}</p>}
                </div>
                <div className="mb-4 relative w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
                  <input
                    type="date"
                    placeholder="Date"
                    className={`w-full p-2 border-2 rounded bg-transparent border-black-200 text-black-300 focus:outline [color-scheme:light] ${expenseErrors.date ? 'border-red-500' : ''}`}
                    {...registerExpense("date", {
                      required: "Date is required"
                    })}
                  />
                  {expenseErrors.date && <p className="text-danger text-sm mt-1">{expenseErrors.date.message}</p>}
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-success-500 text-white p-2 rounded flex items-center justify-center hover:scale-105 transition duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    "Create Expense"
                  )}
                </button>
              </form>
            </div>
     
        </div>
      );
    };
  return (
    <div className="p-4 relative sm:px-16 px-6 sm:py-16 py-10">
      {showToast && 
        <div className="z-100">
          <Toast message={toastMessage} iconName={toastIcon} />
        </div>
      }


      <div
        className={`
          fixed inset-0 flex items-center justify-center 
          bg-black bg-opacity-50 z-50 
          ${
            showExpenseForm
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }
          transition-all duration-300 ease-in-out
        `}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowExpenseForm(false);
          }
        }}
      >
        {showExpenseForm && (
          <div
            className={`
              relative rounded-xl w-auto max-h-[90vh] overflow-y-auto 
              bg-white
              custom-scrollbar
              ${
                showExpenseForm
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
              }
              transition-all duration-300 ease-in-out
              transform origin-center
            `}
          >
            <button
                onClick={() => setShowExpenseForm(false)}
              className="absolute top-6 right-4 p-2 z-100 rounded-full text-black-300 transition-colors duration-200 transform hover:scale-110"
            >
              <X size={24} />
            </button>
            <ExpenseFormModal onClose={() => setShowExpenseForm(false)} />
          </div>
        )}
      </div>




      {/* Content */}
      <div className="w-full">
      <div className="mb-6 text-left text-black-300">
          <h2 className="h2 mb-2 text-left">Other Expenses</h2>
          <div className="flex items-center subtitle-2 text-left">
            <span className="">Accounting / </span>
            <span>Other Expenses</span>
          </div>
        </div>
        {/* Search and Filter Section */}
        <div className="w-full mb-6">
          <div className="relative flex flex-col sm:flex-row items-center mb-4">
            <div className="flex items-center w-full sm:w-auto mb-4 sm:mb-0 mr-4">
              <div className="relative w-full">
                <div className="relative flex items-center border border-gray-300 rounded-full w-full">
                  <div className="absolute left-3">
                    <Search size={20} className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search transactions"
                    className="p-3 pl-10 rounded-full bg-transparent border-2 border-black-200 text-black-300 focus:outline  w-full"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3"
                    >
                      <X size={16} className="text-gray-500" />
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex w-full sm:w-auto space-x-4 ">
              {/* Status/Month Filter */}
              <div className="relative w-full sm:w-40">
                <button 
                  className="flex items-center justify-between w-full px-4 py-2  bg-transparent border-2 rounded-lg border-black-200 text-black-300 focus:outline "
                  onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                >
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2 text-danger" />
                    <span className="text-black-200">{selectedMonth || "Month"}</span>
                  </div>
                  <ChevronDown size={16} />
                </button>
                
                {showMonthDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white  text-black-200 border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {selectedMonth && (
                      <div 
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-medium text-danger"
                        onClick={() => handleMonthSelect("")}
                      >
                        Clear Filter
                      </div>
                    )}
                    {months.map((month) => (
                      <div 
                        key={month} 
                        className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${selectedMonth === month ? 'bg-gray-100 font-medium' : ''}`}
                        onClick={() => handleMonthSelect(month)}
                      >
                        {month}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
            </div>
          </div>
        </div>



{
showConfirmation && (
        <div
          className={`
            fixed inset-0 flex items-center justify-center 
            bg-black bg-opacity-50 z-50 
            ${
              showConfirmation
                ? "opacity-100 visible"
                : "opacity-0 invisible pointer-events-none"
            }
            transition-all duration-300 ease-in-out
          `}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              dispatch(setShowConfirmationModel(false))
              setSelectedExpenses(null);
            }
          }}
        >
          <Confirmation 
            message={`Are you sure you want to delete the selected expenses? This action cannot be undone.`}
            note=""/>
        </div>
      )}





        {/* Expenses Section */}
        <div className="transform transition-all duration-300 translate-x-0 opacity-100">
          {/* Header with Add Button and Delete Button */}
          <div className="flex justify-between items-center mb-4">
     
              <h2 className=" text-md lg:text-2xl font-bold text-black-200">{currentYear} {selectedMonth}</h2>
        
            <div className=" text-md lg:text-3xl text-black-300 font-bold">₹{totalFilteredExpenses.toFixed(2)}</div>
          </div>

          {/* Add and Delete Buttons */}
          <div className="flex justify-end items-center mb-4">
            <div className="flex items-center gap-4">
              {selectedExpenses.length > 0 && (
                <button
                  onClick={handleDeleteExpenses}
                  className="bg-danger  text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    "Delete Selected"
                  )}
                </button>
              )}
              <button
                onClick={() => setShowExpenseForm(true)}
                className="flex items-center p-2 bg-success-500 text-white rounded-full transition-colors duration-200 transform hover:scale-105"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* Expenses List */}
          <div className="bg-gray-50 rounded-lg p-4 w-full z-10">
            <div className="space-y-4">
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense,index) => (
                  <div
                    key={expense._id}
                    className={`p-4  rounded-lg shadow-sm flex items-center
                       ${
                      index % 3 === 0
                        ? "bg-lamaPurpleLight"
                        : index % 3 === 1
                        ? "bg-lamaYellowLight"
                        : "bg-lamaSkyLight"
                    }
                    
                    `}
                  >
                    <input
                      type="checkbox"
                      className="mr-4 mt-4"
                      checked={selectedExpenses.includes(expense._id)}
                      onChange={() => handleExpenseSelection(expense._id)}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="size-8 lg:size-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: expense.name.charAt(0).toLowerCase() === 'j' ? '#4CAF50' : expense.name.charAt(0).toLowerCase() === 'm' ? '#F44336' : expense.name.charAt(0).toLowerCase() === 'a' ? '#3F51B5' : '#795548' }}>
                            <span className="text-white text-xl font-semibold">{expense.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <h3 className=" text-left text-md lg:text-lg font-bold text-black-300">
                              {expense.name}
                            </h3>
                          <p className="text-gray-500 text-left">
                          {expense.description}
                          </p>
                        

                            <p className="text-left text-gray-500">
                              {expense.date ? `${new Date(expense.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }).split(' ')[0]} ${new Date(expense.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }).split(' ')[1]}` : '-'}
                            </p>                          
                            </div>
                        </div>
                        <span className="text-md lg:text-xl text-black-300 font-bold flex items-center lg:pr-4 pr-2">₹{expense.amount}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 p-8">
                  No expenses available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherExpenses;