import React, { useState } from 'react';

// Helper function to convert timestamp to readable date
function timeConverter(timestamp: number): string {
    const a = new Date(timestamp);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();
    const hour = a.getHours();
    const min = a.getMinutes();
    const sec = a.getSeconds();
    return `${date} ${month} ${year} ${hour}:${min}:${sec}`;
}

interface WindowData {
    [key: string]: any[];
}

interface SessionData {
    created: number;
    name?: string;
    windows: WindowData;
}

interface SessionProps {
    data: SessionData;
    created: number;
}

export default function Session({ data, created }: SessionProps) {
    const [show, setShow] = useState(false);
    const dateTime = timeConverter(data.created);

    return (
        <div key={data.created.toString()} data-id={data.created.toString()} className="card">
            <div className="card-header clearfix cf" id={data.created.toString()}>
                <h5 className="mb-0 float-left">
                    <button
                        className="btn btn-link"
                        type="button"
                        data-toggle="collapse"
                        data-target={`#collapse${dateTime}`}
                        aria-expanded="true"
                        aria-controls={`collapse${dateTime}`}
                        onClick={() => setShow(!show)}>
                        {data.name && <span className="session-name">{data.name}</span>}
                        <span className="session-datetime">{dateTime}</span>
                    </button>
                    <span className="pull-right">
                        {Object.keys(data.windows).map((key, index) => (
                            <small
                                title="Tab count for window"
                                className="session-tab-count badge badge-success"
                                key={index}>
                                {data.windows[key].length}
                            </small>
                        ))}
                    </span>
                </h5>
            </div>
        </div>
    );
}

Session.defaultProps = {
    data: {
        created: Date.now(),
        windows: {}
    }
};