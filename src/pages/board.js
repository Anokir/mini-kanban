import React, { useState, useEffect } from "react";
import "./KanbanBoard.css";
import DropdownMenu from "../components/dropdownMenu";

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [grouping, setGrouping] = useState("Status");
  const [ordering, setOrdering] = useState("Priority");
  const [listing, setListing] = useState(undefined);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("https://api.quicksell.co/v1/internal/frontend-assignment");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTickets(data.tickets);
        setUsers(data.users);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  const sortTickets = (ticketsToSort) => {
    if (ordering === "Priority") {
      return [...ticketsToSort].sort((a, b) => b.priority - a.priority);
    } else if (ordering === "Title") {
      return [...ticketsToSort].sort((a, b) => a.title.localeCompare(b.title));
    }
    return ticketsToSort;
  };

  useEffect(() => {
    let lists = [];
    if (grouping === "Status") {
      lists = [
        { icon: "/icons/backlog.png", heading: "Backlog", list: tickets.filter((ticket) => ticket.status === "Backlog") },
        { icon: "/icons/todo.svg", heading: "Todo", list: tickets.filter((ticket) => ticket.status === "Todo") },
        { icon: "/icons/inprogress.svg", heading: "InProgress", list: tickets.filter((ticket) => ticket.status === "In progress") },
        { icon: "/icons/done.png", heading: "Done", list: tickets.filter((ticket) => ticket.status === "Done") },
        { icon: "/icons/cancelled.svg", heading: "Cancelled", list: tickets.filter((ticket) => ticket.status === "Cancelled") },
      ];
    } else if (grouping === "User") {
      lists = users.map((user) => ({
        icon: "/icons/user.png",
        heading: user.name,
        list: tickets.filter((ticket) => ticket.userId === user.id),
      }));
    } else if (grouping === "Priority") {
      lists = [
        { icon: "/icons/nopriority.svg", heading: "No Priority", list: tickets.filter((ticket) => ticket.priority === 0) },
        { icon: "/icons/urgent.svg", heading: "Urgent", list: tickets.filter((ticket) => ticket.priority === 4) },
        { icon: "/icons/high.svg", heading: "High", list: tickets.filter((ticket) => ticket.priority === 3) },
        { icon: "/icons/medium.svg", heading: "Medium", list: tickets.filter((ticket) => ticket.priority === 2) },
        { icon: "/icons/low.svg", heading: "Low", list: tickets.filter((ticket) => ticket.priority === 1) },
      ];
    }

    const sortedLists = lists.map((list) => ({
      ...list,
      list: sortTickets(list.list),
    }));

    setListing(sortedLists);
  }, [tickets, grouping, ordering]);

  return (
    <div>
      <DropdownMenu
        grouping={grouping}
        ordering={ordering}
        setGrouping={setGrouping}
        setOrdering={setOrdering}
      />
      <div className="kanban-board">
        {listing &&
          listing.map((list) => (
            <KanbanColumn
              key={list.heading}
              heading={list.heading}
              list={list.list}
              icon={list.icon}
            />
          ))}
      </div>
    </div>
  );
};

const KanbanColumn = ({ heading, list, icon }) => {
  const getPriorityIconSrc = (priority) => {
    switch (priority) {
      case 0: return "/icons/nopriority.svg"; // No Priority
      case 1: return "/icons/low.svg";       // Low
      case 2: return "/icons/medium.svg";    // Medium
      case 3: return "/icons/high.svg";      // High
      case 4: return "/icons/urgent.svg";    // Urgent
      default: return "/icons/nopriority.svg"; // Default to No Priority
    }
  };

  const getStatusIconSrc = (status) => {
    switch (status) {
      case "Backlog": return "/icons/backlog.png";
      case "Todo": return "/icons/todo.svg";
      case "In progress": return "/icons/inprogress.svg";
      case "Done": return "/icons/done.png";
      case "Cancelled": return "/icons/cancelled.svg";
      default: return "/icons/backlog.png";
    }
  };

  return (
    <div className="column">
      <div className="header">
        <div style={{ display: "flex", alignItems: "center" }}>
          {icon && <img src={icon} alt="icon" height={18} style={{ marginLeft: "5px" }} />}
          <h3 className="column-title">
            {heading}
            <span className="ticket-count">{list.length || 0}</span>
          </h3>
        </div>
      </div>
      {list.map((ticket) => (
        <div className="card" key={ticket.id}>
          <div style={{ display: "flex", justifyContent: "space-between"}}>
            <span>{ticket.id}</span>
            <img src="/icons/user.png" height={20} alt="ticket" style={{ marginTop: "10px" }}/>
          </div>
          
          <h4 className="ticket-title">{ticket.title}</h4>
          <div className="box1">
            <img 
              src={getPriorityIconSrc(ticket.priority)} 
              alt={`Priority ${ticket.priority}`} 
              className="priority-icon" 
              height={20} 
            />
            <span className="tag">{ticket.tag.join(", ")}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
