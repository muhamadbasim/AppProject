/**
 * Utility to export data as a file
 * @param {string} content - The content to export
 * @param {string} fileName - The name of the file
 * @param {string} contentType - The MIME type
 */
function downloadFile(content, fileName, contentType) {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
}

/**
 * Export tasks as CSV
 * @param {Array} tasks - Array of task objects
 */
export function exportTasksToCSV(tasks) {
    if (!tasks || tasks.length === 0) return;

    const headers = ["ID", "Name", "Status", "Progress", "Priority", "Assignee", "Due Days"];
    const rows = tasks.map(t => [
        t.id,
        `"${t.name.replace(/"/g, '""')}"`,
        t.status,
        `${t.progress}%`,
        t.priority,
        t.assignee,
        t.due_days
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    downloadFile(csvContent, `tasks_export_${new Date().toISOString().slice(0, 10)}.csv`, "text/csv");
}

/**
 * Export data as JSON
 * @param {Object|Array} data - The data to export
 * @param {string} prefix - Filename prefix
 */
export function exportToJSON(data, prefix = "data") {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, `${prefix}_export_${new Date().toISOString().slice(0, 10)}.json`, "application/json");
}
