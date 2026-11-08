import alasql from "alasql";

export class FakeServer {
  constructor(allData, searchQuery = "") {
    this.allData = allData;
    this.searchQuery = searchQuery;
  }

  getData(request) {
    const filteredData = this.applySearchFilter(this.allData, this.searchQuery);
    const SQL = this.buildSql(request);
    console.log("[FakeServer] - Running SQL:", SQL);

    try {
      const results = alasql(SQL, [filteredData]);
      console.log("[FakeServer] - Results:", results);

      const rowsThisPage = results;
      const lastRow = this.getLastRowIndex(request, results, filteredData);

      return {
        success: true,
        rows: rowsThisPage,
        lastRow: lastRow,
      };
    } catch (err) {
      console.error("[FakeServer] - SQL error:", err);
      return { success: false };
    }
  }

  applySearchFilter(data, query) {
    if (!query.trim()) return data; // Return all data if no query

    const lowerQuery = query.toLowerCase();
    console.log("[FakeServer] - Filtering with query:", query);

    const filtered = data.filter((row) => {
      const match = Object.values(row).some((val) =>
        String(val).toLowerCase().includes(lowerQuery)
      );
      return match;
    });

    console.log("[FakeServer] - Filtered Data:", filtered); // Add this to inspect filtered data
    return filtered;
  }

  buildSql(request) {
    const startRow = request.startRow;
    const endRow = request.endRow;

    const sortModel = request.sortModel || [];
    const sortBy =
      sortModel.length > 0
        ? `ORDER BY ${sortModel
            .map((s) => `${s.colId} ${s.sort.toUpperCase()}`)
            .join(", ")}`
        : "";

    return `
      SELECT * FROM ?
      ${sortBy}
      LIMIT ${endRow - startRow} OFFSET ${startRow}
    `;
  }

  getLastRowIndex(request, results, filteredData) {
    const currentLastRow = request.startRow + results.length;
    return filteredData.length <= currentLastRow ? filteredData.length : -1;
  }
}
