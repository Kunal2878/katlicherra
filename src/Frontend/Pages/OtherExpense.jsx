import { useState, useEffect } from "react";
import Toast from "../Components/Toast";
import Cookies from "js-cookie";
import { X, Plus, Loader } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { setOtherExpenseData } from "../../Store/slice";
import { useForm } from "react-hook-form";
import { AddOtherExpenseAPI, GetOtherExpenseAPI, DeleteOtherExpenseByIDAPI } from '../../service/api';

const OtherExpenses = () => {
  const token = Cookies.get("token");
  const url = import.meta.env.VITE_API_BASE_URL;
  const dispatch = useDispatch();

  const expenses = useSelector((state) => state.userData.OtherExpenseData);
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastIcon, setToastIcon] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

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
    try {
      const response = await AddOtherExpenseAPI(url, data, token);
      if (response.status === 200 || response.status === 201 || response.status === 204) {
        await fetchExpenses();
        resetExpense();
        setToastMessage("Expense created successfully");
        setToastIcon("right");
        setShowExpenseForm(false);
      } else {
        setToastMessage(response.message);
        setToastIcon("wrong");
      }
    } catch (error) {
      setToastMessage("Failed to create expense");
      setToastIcon("wrong");
    } finally {
      setShowToast(true);
      setIsLoading(false);
    }
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
    setIsLoading(true);
    
    try {
      // Process one by one since API requires individual expense ID
      for (const expenseId of selectedExpenses) {
        await DeleteOtherExpenseByIDAPI(url, expenseId, token);
      }
      
      await fetchExpenses();
      setSelectedExpenses([]);
      setToastMessage("Expenses deleted successfully");
      setToastIcon("right");
    } catch (error) {
      setToastMessage("Failed to delete expenses");
      setToastIcon("wrong");
    } finally {
      setShowToast(true);
      setIsLoading(false);
    }
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

  // Calculate total expenses
  const totalExpenses = Array.isArray(expenses) && expenses.length > 0
    ? expenses.reduce((sum, expense) => sum + Number(expense.amount), 0)
    : 0;

  // Expense Form Modal
  const ExpenseFormModal = () => (
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
      <div
        className={`
          relative rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto 
          bg-white p-6 custom-scrollbar
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
          className="absolute top-6 right-6 p-2 bg-white rounded-full text-black-300 hover:scale-110"
        >
          <X size={24} />
        </button>
        <h2 className="h2 mb-[32px] text-left">Add Expense</h2>

        {/* Expense Form with React Hook Form */}
        <form onSubmit={handleSubmitExpense(onExpenseSubmit)} className="mb-[16px]">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Expense Name"
              className={`w-full p-2 rounded bg-transparent border-2 border-black-200 text-black-300 focus:outline ${expenseErrors.name ? 'border-red-500' : ''}`}
              {...registerExpense("name", { required: "Name is required" })}
            />
            {expenseErrors.name && <p className="text-red-500 text-sm mt-1">{expenseErrors.name.message}</p>}
          </div>
          
          <div className="mb-4">
            <textarea
              placeholder="Description"
              className={`w-full h-32 p-2 border-2 rounded bg-transparent border-black-200 text-black-300 focus:outline resize-none ${expenseErrors.description ? 'border-red-500' : ''}`}
              {...registerExpense("description", { required: "Description is required" })}
            />
            {expenseErrors.description && <p className="text-red-500 text-sm mt-1">{expenseErrors.description.message}</p>}
          </div>
          
          <div className="mb-4">
            <input
              type="number"
              placeholder="Amount"
              className={`w-full p-2 border-2 rounded bg-transparent border-black-200 text-black-300 focus:outline ${expenseErrors.amount ? 'border-red-500' : ''}`}
              {...registerExpense("amount", { 
                required: "Amount is required",
                min: { value: 1, message: "Amount must be greater than 0" }
              })}
            />
            {expenseErrors.amount && <p className="text-red-500 text-sm mt-1">{expenseErrors.amount.message}</p>}
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

  return (
    <div className="p-4 relative sm:px-16 px-6 sm:py-16 py-10">
      {showToast && 
        <div className="z-100">
          <Toast message={toastMessage} iconName={toastIcon} />
        </div>
      }

      {/* Modals */}
      <ExpenseFormModal />

      {/* Content */}
      <div className="w-full">
        {/* Expenses Section */}
        <div className="transform transition-all duration-300 translate-x-0 opacity-100">
          {/* Header with Add Button and Delete Button */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-black-300">Other Expenses</h2>
            <div className="flex items-center gap-4">
              {selectedExpenses.length > 0 && (
                <button
                  onClick={handleDeleteExpenses}
                  className="bg-danger text-white px-4 py-2 rounded flex items-center gap-2"
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
          <div className="bg-white rounded-lg p-4 w-full z-10">
            <div className="space-y-4">
              {Array.isArray(expenses) && expenses.length > 0 ? (
                expenses?.map((expense, index) => (
                  <div
                    key={expense._id}
                    className={`p-4 rounded-lg flex items-start ${
                      index % 3 === 0
                        ? "bg-lamaPurpleLight"
                        : index % 3 === 1
                        ? "bg-lamaYellowLight"
                        : "bg-lamaSkyLight"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="mr-2 mt-1"
                      checked={selectedExpenses.includes(expense._id)}
                      onChange={() => handleExpenseSelection(expense._id)}
                    />
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-bold text-black-300">
                        {expense.name}
                      </h3>
                      <p className="text-sm text-black-300 mt-1">{expense.description}</p>
                      <div className="flex justify-between mt-2 text-sm text-black-300">
                        <span>Amount: ₹{expense.amount}</span>
                        <span>{new Date(expense.createdAt).toLocaleDateString('en-GB')}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500">
                  No expenses available
                </div>
              )}
              {Array.isArray(expenses) && expenses.length > 0 && (
                <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                  <h3 className="text-xl font-bold text-black-300">
                    Total Expenses: ₹{totalExpenses.toFixed(2)}
                  </h3>
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