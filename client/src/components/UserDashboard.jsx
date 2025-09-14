import React, { useEffect, useState } from "react";
// In a real app, you would use your actual imports.
// For this example, we'll use placeholders for assets and Redux hooks.
// import logo_with_title from "../assets/logo-with-title-black.png";
// import returnIcon from "../assets/redo.png";
// import browseIcon from "../assets/pointing.png";
// import bookIcon from "../assets/book-square.png";
// import logo from "../assets/black-logo.png";
// import { useSelector } from "react-redux";
// import Header from "../layout/Header";

import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
);

// --- MOCKED COMPONENTS AND DATA (for demonstration) ---

// Mocked Header component
const Header = () => (
  <header className="absolute top-0 left-0 right-0 bg-white shadow-md p-4 z-10">
    <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
            <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.747h18" /></svg>
            <h1 className="text-xl font-bold">BookWorm Library</h1>
        </div>
        <div className="text-right">
            <p className="font-semibold">User</p>
            <p className="text-sm text-gray-500">Aug 12, 2025</p>
        </div>
    </div>
  </header>
);

// Mocked useSelector hook to simulate Redux store
const useMockSelector = () => {
  return {
    userBorrowedBooks: [
      { id: 1, title: "Book A", returned: false },
      { id: 2, title: "Book B", returned: false },
      { id: 3, title: "Book C", returned: false },
      { id: 4, title: "Book D", returned: true },
      { id: 5, title: "Book E", returned: true },
    ],
  };
};

// Placeholder icons as SVG components
const BookIcon = () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.747h18" /></svg>;
const ReturnIcon = () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l4-4m-4 4l4 4" /></svg>;
const BrowseIcon = () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" /></svg>;
const Logo = ({ className }) => <svg className={className} viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" stroke="black" strokeWidth="10" fill="none" /><circle cx="35" cy="35" r="5" fill="black" /><circle cx="65" cy="35" r="5" fill="black" /><circle cx="50" cy="65" r="10" fill="black" /></svg>;
const LogoWithTitle = ({ className }) => <div className={className}><Logo className="h-16 w-16 mx-auto" /><p className="text-center font-bold">BookWorm</p></div>;


// --- CORRECTED UserDashboard COMPONENT ---

const UserDashboard = () => {
  // Using the mocked hook. In your app, you'd use the real `useSelector`.
  const { userBorrowedBooks } = useMockSelector();

  const [totalBorrowedBooks, setTotalBorrowedBooks] = useState(0);
  const [totalReturnedBooks, setTotalReturnedBooks] = useState(0);

  useEffect(() => {
    const numberOfTotalBorrowedBooks = userBorrowedBooks.filter(
      (book) => book.returned === false
    );
    // FIX: The filter logic for returned books was incorrect.
    // It should check for `book.returned === true`.
    const numberOfTotalReturnedBooks = userBorrowedBooks.filter(
      (book) => book.returned === true
    );
    setTotalBorrowedBooks(numberOfTotalBorrowedBooks.length);
    setTotalReturnedBooks(numberOfTotalReturnedBooks.length);
  }, [userBorrowedBooks]);

  const data = {
    labels: ["Borrowed Books", "Returned Books"],
    datasets: [
      {
        data: [totalBorrowedBooks, totalReturnedBooks],
        backgroundColor: ["#3D3E3E", "#9CA3AF"], // Changed second color for better contrast
        borderColor: ['#FFFFFF', '#FFFFFF'],
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false, // We will create a custom legend
        },
        tooltip: {
            callbacks: {
                label: function(context) {
                    let label = context.label || '';
                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed !== null) {
                        label += context.parsed;
                    }
                    return label;
                }
            }
        }
    },
    cutout: 0, // This makes it a pie chart instead of a doughnut chart.
  };

  // Reusable Card component for cleaner code
  const InfoCard = ({ icon, text, value }) => (
    <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200 w-full">
      <div className="bg-gray-100 p-4 rounded-lg text-black">
        {icon}
      </div>
      <div className="flex-grow">
        <p className="text-md font-semibold text-gray-800">{text}</p>
        {value !== undefined && <p className="text-2xl font-bold text-black">{value}</p>}
      </div>
    </div>
  );


  return (
    <main className="relative flex-1 bg-gray-50 p-6 pt-28 min-h-screen">
      <Header />
      {/* FIX: Simplified the main layout container for better responsiveness. */}
      {/* `flex-col-reverse` places the chart on top on mobile screens. */}
      <div className="flex flex-col-reverse xl:flex-row gap-6">
        
        {/* LEFT SIDE */}
        <div className="flex-[3] flex flex-col gap-6">
          {/* FIX: Used a grid for the cards for a more stable layout. */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InfoCard icon={<BookIcon />} text="Your Borrowed Books" value={totalBorrowedBooks} />
            <InfoCard icon={<ReturnIcon />} text="Your Returned Books" value={totalReturnedBooks} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
             <InfoCard icon={<BrowseIcon />} text="Browse Books Inventory" />
             {/* <div className="hidden lg:flex justify-center items-center p-4 bg-white rounded-lg shadow-sm h-full">
                <LogoWithTitle className="w-auto" />
             </div> */}
          </div>
          
          <div className="bg-white p-7 rounded-2xl shadow-sm relative flex-1 flex items-center">
            <div>
              {/* FIX: Corrected typo `xl-text-xl` to `xl:text-xl` */}
              <h4 className="text-xl xl:text-2xl font-semibold text-gray-800">
                "Embarking on the journey of reading fosters personal growth,
                nurturing a path towards excellence and the refinement of
                character."
              </h4>
              <p className="text-gray-600 text-md absolute right-7 bottom-5">
                ~ BookWorm Team
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        {/* FIX: Simplified the right side layout for the chart and legend. */}
        <div className="flex-[2] flex flex-col gap-6 p-6 bg-white rounded-2xl shadow-sm">
          <h3 className="text-xl font-bold text-gray-800 text-center">Your Activity</h3>
          <div className="relative h-64 md:h-80 w-full mx-auto">
            <Pie data={data} options={options} />
          </div>
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 rounded-full" style={{backgroundColor: data.datasets[0].backgroundColor[0]}}></span>
              <span className="font-medium text-gray-700">Borrowed Books: {totalBorrowedBooks}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 rounded-full" style={{backgroundColor: data.datasets[0].backgroundColor[1]}}></span>
              <span className="font-medium text-gray-700">Returned Books: {totalReturnedBooks}</span>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
};


// --- MAIN App COMPONENT (for demonstration) ---
// This would be your App.js or equivalent entry point.
export default function App() {
  // In a real app, you would have your Redux Provider and Router here.
  return (
    <div className="bg-gray-50">
      {/* The sidebar is not included, but this dashboard would live alongside one. */}
      <UserDashboard />
    </div>
  );
}
