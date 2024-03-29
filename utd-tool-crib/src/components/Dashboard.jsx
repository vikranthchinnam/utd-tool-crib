import "../styles/header.css";
import logo from "../styles/logo.svg";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
// import {orderData} from "../data/db";
// import orderData from "../data/db.json";
import "../styles/logGrid.css";
import axios from "axios";
import { writeFile, utils } from "xlsx";

function Dashboard() {
  console.log(logo);

  const [data, setData] = useState([]);
  const [currentDate, setDate] = useState("");
  const [currentMonth, setMonth] = useState("");
  const [currentYear, setYear] = useState("");

  const PORT = 3002;
  useEffect(() => {
    async function fetchData() {
      await getOrderData();
      const current = new Date();
      // const date = `${
      //   current.getMonth() + 1
      // }/${current.getDate()}/${current.getFullYear()}`;
      setDate(current.getDate());
      setMonth(current.getMonth() + 1);
      setYear(current.getFullYear());
      // setData(_data);
    }
    fetchData();
  }, []);

  function compareDate(fullDate) {
    const compareDay = fullDate.substring(3, 5);
    const compareMonth = fullDate.substring(0, 2);
    const compareYear = fullDate.substring(6, 10);
    if (compareYear >= currentYear) {
      if (compareMonth >= currentMonth) {
        if (compareDay >= currentDate) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  async function getOrderData() {
    axios.get(`http://localhost:${PORT}/logs/`).then((resp) => {
      setData(resp.data);
    });
    // fetch("http://localhost:8000/logs/")
    //   .then((res) => {
    //     return res.json();
    //   })
    //   .then((resp) => {
    //     setData(resp);
    //   })
    //   .catch((error) => {
    //     console.log(error.message);
    //   });
  }

  const exportLogs = (event) => {
    axios.post(`http://localhost:${PORT}/logs/export/`).then((resp) => {
      const data = resp.data;
      const workbook = utils.book_new();
      const worksheet = utils.aoa_to_sheet(data);
      utils.book_append_sheet(workbook, worksheet, "Sheet1");
      writeFile(workbook, "output.xlsx");
    });
  };
  return (
    <div className="dashboard">
      <div className="header">
        <div className="title">
          <img src={logo} alt="" />
          <h1>Dashboard</h1>
        </div>

        <div className="header-buttons">
          <Link to="/Borrow-Tool">
            <button>Borrow Tool</button>
          </Link>
          <Link to="/Return-Tool">
            <button>Return Tool</button>
          </Link>
          <Link to="/Manage-Teams">
            <button>Admin Panel</button>
          </Link>
          <button>Log Out</button>
        </div>
      </div>
      <div>
        <button className="export" onClick={exportLogs}>Export Log History</button>
      </div>
      <div className="grid">
        <div className="column-grid-header">
          <div className="header-cell">Team Number</div>
          <div className="header-cell">Table Number</div>
          <div className="header-cell">Team Member</div>
          <div className="header-cell">Due Date</div>
          <div className="header-cell">Tool Name</div>
          <div className="header-cell">Notes</div>
          <div className="header-cell">Tool Limit</div>
        </div>

        {data &&
          data.map((item) =>
            compareDate(item.dueDate) ? (
              <div id="late" className="column-grid">
                <div className="cell">
                  <p style={{ color: "red" }}>{item["teamNumber"]}</p>
                </div>
                <div className="cell">
                  <p style={{ color: "red" }}>{item["tableNumber"]}</p>
                </div>
                <div className="cell">
                  <p style={{ color: "red" }}>{item["teamMember"]}</p>
                </div>
                <div className="cell">
                  <p style={{ color: "red" }}>{item["dueDate"]}</p>
                </div>
                <div className="cell">
                  <p style={{ color: "red" }}>{item["toolName"]}</p>
                </div>
                <div className="cell">
                  <p style={{ color: "red" }}>{item["notes"]}</p>
                </div>
                <div className="cell">
                  <p style={{ color: "red" }}>{item["toolLimit"]}</p>
                </div>
              </div>
            ) : (
              <div className="column-grid">
                <div className="cell">{item["teamNumber"]}</div>
                <div className="cell">{item["tableNumber"]}</div>
                <div className="cell">{item["teamMember"]}</div>
                <div className="cell">{item["dueDate"]}</div>
                <div className="cell">{item["toolName"]}</div>
                <div className="cell">{item["notes"]}</div>
                <div className="cell">{item["toolLimit"]}</div>
              </div>
            )
          )}
      </div>
    </div>
  );
}
export default Dashboard;
