import React, { useEffect, useState } from "react";
import axios from "axios";
import getBaseUrl from "../../../utils/baseURL";

const LoginHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("adminToken");
            const response = await axios.get(`${getBaseUrl()}/api/admin-auth/login-history`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistory(response.data);
            setError(null);
        } catch (error) {
            console.error("Failed to fetch login history:", error);
            setError("Failed to load logs.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    if (loading) return <div className="p-4 font-mono text-sm bg-[#0d1117] text-gray-300 min-h-screen">Loading logs...</div>;
    if (error) return <div className="p-4 font-mono text-sm bg-[#0d1117] text-red-400 min-h-screen">{error}</div>;

    return (
        <div className="p-4 bg-[#0d1117] min-h-screen text-gray-300 font-mono">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold text-[#58a6ff]">System Login Logs</h1>
                    <button
                        onClick={fetchHistory}
                        className="px-4 py-1.5 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] text-xs border border-[#30363d] rounded transition-colors"
                    >
                        REFRESH
                    </button>
                </div>

                <div className="overflow-x-auto border border-[#30363d] rounded-md">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-[#161b22] border-b border-[#30363d]">
                                <th className="p-3 border-r border-[#30363d] text-[#8b949e]">TIMESTAMP</th>
                                <th className="p-3 border-r border-[#30363d] text-[#8b949e]">STATUS</th>
                                <th className="p-3 border-r border-[#30363d] text-[#8b949e]">USER</th>
                                <th className="p-3 border-r border-[#30363d] text-[#8b949e]">IP ADDRESS</th>
                                <th className="p-3 text-[#8b949e]">CLIENT INFO</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#21262d]">
                            {history.length > 0 ? (
                                history.map((log) => (
                                    <tr key={log._id} className="hover:bg-[#161b22] transition-colors">
                                        <td className="p-3 border-r border-[#30363d] whitespace-nowrap text-[#79c0ff]">
                                            {new Date(log.timestamp).toLocaleString('en-GB', { hour12: false })}
                                        </td>
                                        <td className={`p-3 border-r border-[#30363d] font-bold ${log.status === 'Success' ? 'text-[#3fb950]' : 'text-[#f85149]'}`}>
                                            {log.status.toUpperCase()}
                                        </td>
                                        <td className="p-3 border-r border-[#30363d]">
                                            <span className="text-[#c9d1d9]">{log.userId?.username || 'Unknown'}</span>
                                            <span className="text-[#8b949e] ml-2">&lt;{log.userId?.email}&gt;</span>
                                        </td>
                                        <td className="p-3 border-r border-[#30363d] text-[#a5d6ff]">
                                            {log.ip}
                                        </td>
                                        <td className="p-3 text-[#8b949e]">
                                            <span className="bg-[#21262d] px-1.5 py-0.5 rounded border border-[#30363d] mr-1">{log.device}</span>
                                            <span className="mr-1">{log.os}</span>
                                            <span>/ {log.browser}</span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-[#8b949e] italic">
                                        No log entries found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="mt-2 text-xs text-[#484f58] text-right">
                    Total records: {history.length}
                </div>
            </div>
        </div>
    );
};

export default LoginHistory;
