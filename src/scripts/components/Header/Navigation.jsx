import { Badge } from "antd";
import React from "react";

export default function Navigation({ tabCount }) {
  console.log("reloading navigation");
  return (
    <div className="flex flex-grow" id="navbarNav">
      <ul className="flex justify-start w-full mb-0">
        <li className="px-4 py-3">
          <Badge
            overflowCount={999}
            offset={[5, -3]}
            count={tabCount}
            color={tabCount > 50 ? "orange" : "green "}
            size="small"
          >
            <a
              className=" text-white font-weight-bold"
              href="/tabs.html"
              id="go-to-tabs"
            >
              Tabs
              <span className="sr-only">(current)</span>
            </a>
          </Badge>
        </li>
        <li className="px-4 py-3">
          <a className=" text-white" href="/sessions.html">
            Sessions
          </a>
        </li>
      </ul>
    </div>
  );
}
