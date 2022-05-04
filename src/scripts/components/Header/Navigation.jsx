import React from "react";

export default function Navigation({ tabCount }) {
  console.log("reloading navigation");
  return (
    <div className="d-flex flex-grow-1" id="navbarNav">
      <ul className="d-flex">
        <li className="nav-item active">
          <a
            className="nav-link text-white font-weight-bold"
            href="/tabs.html"
            id="go-to-tabs"
          >
            Tabs{" "}
            <span
              className={
                `active-tab-counter badge ` +
                (tabCount > 50 ? "badge-danger" : "badge-success")
              }
            >
              {tabCount}
            </span>
            <span className="sr-only">(current)</span>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link text-white" href="/sessions.html">
            Sessions
          </a>
        </li>
      </ul>
    </div>
  );
}
