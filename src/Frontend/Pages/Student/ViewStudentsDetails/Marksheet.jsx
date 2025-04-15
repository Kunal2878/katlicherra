import { useState, useRef } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import * as domToImage from 'dom-to-image';
import { jsPDF } from 'jspdf';
import { FileText, Download } from 'lucide-react';

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#e6f2ff',
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c5282',
  },
  schoolName: {
    fontSize: 14,
    color: '#4a5568',
    marginBottom: 5,
  },
  studentInfo: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: 80,
    fontWeight: 'bold',
    fontSize: 12,
  },
  value: {
    fontSize: 12,
  },
  table: {
    display: 'table',
    width: 'auto',
    marginBottom: 20,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: '#4a89dc',
    color: '#ffffff',
    fontWeight: 'bold',
    padding: 5,
    fontSize: 12,
    textAlign: 'center',
  },
  tableCell: {
    padding: 5,
    fontSize: 12,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#bfbfbf',
  },
  footer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f7fafc',
  },
  summary: {
    marginBottom: 10,
  },
  comment: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 5,
  },
});

const StudentMarksheet = ({ studentData, examData, results }) => {
  const marksheetRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
console.log(studentData,examData,results)
  // Calculate total marks, obtained marks and percentage
  const calculateResults = () => {
    if (!results || results.length === 0) return { totalObtained: 0, totalMax: 0, percentage: 0 };
    
    const totalObtained = results.reduce((sum, result) => sum + result.marksObtained, 0);
    const totalMax = results.reduce((sum, result) => sum + result.maxMarks, 0);
    const percentage = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(2) : 0;
    
    return { totalObtained, totalMax, percentage };
  };

  // Determine grade based on percentage
  const getGrade = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= 40) return 'D';
    return 'F';
  };

  // Generate a performance message
  const getPerformanceMessage = (percentage) => {
    if (percentage >= 90) return 'Outstanding performance! Keep up the excellent work.';
    if (percentage >= 80) return 'Excellent performance! You have shown great understanding.';
    if (percentage >= 70) return 'Very good performance! Continue working hard.';
    if (percentage >= 60) return 'Good performance! With more effort, you can achieve higher.';
    if (percentage >= 50) return 'Satisfactory performance. Focus on areas that need improvement.';
    if (percentage >= 40) return 'Fair performance. You need to work harder to improve.';
    return 'Needs significant improvement. Please seek additional help and guidance.';
  };

  // Find the exam name based on examId
  

  const { totalObtained, totalMax, percentage } = calculateResults();
  
  // Method to download marksheet as PDF
  const downloadMarksheet = async () => {
    if (!marksheetRef.current) return;
    
    setIsGenerating(true);
    
    try {
      const dataUrl = await domToImage.toPng(marksheetRef.current, {
        quality: 1.0,
        width: 794, // A4 width in pixels at 96 DPI
        height: 1123, // A4 height in pixels at 96 DPI
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          width: '794px',
          height: '1123px'
        }
      });
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4'
      });
      
      // Calculate the dimensions
      const imgWidth = 794;
      const imgHeight = 1123;
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${studentData?.name || 'Student'}_Marksheet.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  if (!studentData || !results || results.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-center text-black-100">No results available to generate marksheet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-black-300 mb-4">Student Marksheet</h2>
      
      <div className="mb-4">
        <button
          onClick={downloadMarksheet}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 transition"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <span className="mr-2">Generating...</span>
          ) : (
            <>
              <Download className="h-5 w-5 mr-2" />
              <span>Download Marksheet</span>
            </>
          )}
        </button>
      </div>
      
      {/* Marksheet Preview */}
      <div 
        ref={marksheetRef} 
        className="border border-gray-300 rounded-lg overflow-hidden bg-white w-full max-w-4xl mx-auto p-6"
        style={{ maxWidth: '794px' }}
      >
        {/* Header */}
        <div className="flex items-center bg-blue-100 p-4 rounded-t-lg">
          <div className="flex-shrink-0 mr-4">
            <div className="w-16 h-16 flex items-center justify-center bg-blue-500 rounded-full">
              <FileText className="h-8 w-8 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-blue-800">REPORT CARD</h1>
            <p className="text-black-300">Katlicherra Central School</p>
          </div>
        </div>
        
        {/* Student Information */}
        <div className="p-4 border-b border-gray-300 text-black-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="mb-2">
                <span className="font-semibold mr-2">Student Name:</span>
                <span>{studentData?.name || 'N/A'}</span>
              </p>
              <p className="mb-2">
                <span className="font-semibold mr-2">Class:</span>
                <span>{studentData?.studentClass.className || 'N/A'}</span>
              </p>
            </div>
            <div>
              <p className="mb-2">
                <span className="font-semibold mr-2">Examination:</span>
                <span>{examData}</span>
              </p>
            </div>
          </div>
        </div>
        
        {/* Marks Table */}
        <div className="p-4 overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="py-2 px-4 text-left border-b border-gray-300">Subject</th>
                <th className="py-2 px-4 text-center border-b border-gray-300">Obtained Marks</th>
                <th className="py-2 px-4 text-center border-b border-gray-300">Total Marks</th>
                <th className="py-2 px-4 text-center border-b border-gray-300">Grade</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => {
                const subjectPercentage = (result.marksObtained / result.maxMarks) * 100;
                const grade = getGrade(subjectPercentage);
                
                return (
                  <tr key={index} className={`text-black-300`+ index % 2 === 0 ? 'bg-gray-50 text-black-300' : 'bg-white text-black-300'}>
                    <td className="py-2 px-4 border-b border-gray-300">{result.subject}</td>
                    <td className="py-2 px-4 text-center border-b border-gray-300">{result.marksObtained}</td>
                    <td className="py-2 px-4 text-center border-b border-gray-300">{result.maxMarks}</td>
                    <td className="py-2 px-4 text-center border-b border-gray-300">{grade}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-semibold text-black-300">
                <td className="py-2 px-4 border-b border-gray-300">Total</td>
                <td className="py-2 px-4 text-center border-b border-gray-300">{totalObtained}</td>
                <td className="py-2 px-4 text-center border-b border-gray-300">{totalMax}</td>
                <td className="py-2 px-4 text-center border-b border-gray-300">{getGrade(percentage)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        {/* Summary */}
        <div className="p-4 bg-gray-50 rounded-b-lg text-black-300">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Performance Summary</h3>
            <div className="flex justify-between items-center mb-2">
              <p className="font-medium">Total Percentage:</p>
              <p className="font-bold text-lg">{percentage}%</p>
            </div>
            <div className="flex justify-between items-center mb-2">
              <p className="font-medium">Overall Grade:</p>
              <p className="font-bold text-lg">{getGrade(percentage)}</p>
            </div>
          </div>
          
          <div className="border-t border-gray-300 pt-4">
            <h3 className="text-lg font-semibold mb-2">Teacher's Comment</h3>
            <p className="italic text-gray-700">{getPerformanceMessage(percentage)}</p>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-300 flex justify-between">
            <div>
              <p className="font-semibold mb-1">Parent's Signature</p>
              <div className="w-32 border-b border-gray-400 h-8"></div>
            </div>
            <div>
              <p className="font-semibold mb-1">Teacher's Signature</p>
              <div className="w-32 border-b border-gray-400 h-8"></div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-4 text-center text-sm text-black-100">
          <p>This report card was generated by Katlicherra Central School on {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default StudentMarksheet;